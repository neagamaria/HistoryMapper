import requests
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.parsers import JSONParser

from HistoryMapper import utils
from explore.models import MapLocation, Event, EventType, Category, Video
from django.db.models.functions import Lower

from rest_framework import status

from sklearn.cluster import KMeans


# call the Geocoding API
def get_coordinates(location):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?key={utils.GOOGLE_API_KEY}&address={location}"
    response = requests.get(url)
    data = response.json()

    if data['status'] == "OK":
        coordinates = data['results'][0]['geometry']['location']
        return coordinates['lat'], coordinates['lng']

    return 0, 0


# obtain needed locations and add entries in the db
def populate_map_location(events):
    # get all events locations that do not have entries in the db
    all_event_locations = set(event.location for event in events)
    map_locations = set(MapLocation.objects.raw('''SELECT id, name FROM explore_maplocation'''))
    all_map_locations = set(location.name for location in map_locations)
    new_locations = all_event_locations.difference(all_map_locations)

    #  populate the MapLocation table with names and coordinates
    for location in new_locations:
        lat, lng = get_coordinates(location)
        if lat and lng:
            MapLocation.objects.create(
                name=location,
                latitude=lat,
                longitude=lng
            )


# API endpoint for getting events from the db and displaying them on map
class EventsBetweenYearsAPIView(APIView):
    # get all events in a time period with their coordinates
    def get(self, request, start_year, start_era, end_year, end_era):
        if start_era == 'BC':
            start_year = -start_year
        if end_era == 'BC':
            end_year = -end_year

        events = Event.objects.raw('''SELECT * FROM explore_event
                                    WHERE (era = 'BC' AND -1 * EXTRACT(YEAR FROM event_date) >= %s 
                                    AND -1 * EXTRACT(YEAR FROM event_date) <= %s)
                                    OR (era = 'AD' AND EXTRACT(YEAR FROM event_date) >= %s 
                                    AND EXTRACT(YEAR FROM event_date) <= %s)''',
                                   [start_year, end_year, start_year, end_year])

        populate_map_location(events)

        complete_events = [
            {
                'event': event,
                'latitude': map_location.latitude,
                'longitude': map_location.longitude
            }
            for event in events
            for map_location in MapLocation.objects.filter(name=event.location) if
            map_location.latitude and map_location.longitude
        ]

        data = [{'name': e['event'].name, 'event_date': e['event'].event_date, 'era': e['event'].era,
                 'location': e['event'].location, 'description': e['event'].description,
                 "historical_period": e['event'].historical_period.name, "event_type": e['event'].event_type.name,
                 "event_type_id": e['event'].event_type_id,
                 "category_id": e['event'].category_id,
                 "latitude": e['latitude'],
                 "longitude": e['longitude']}
                for e in complete_events]

        return JsonResponse({'data': data, 'status': status.HTTP_200_OK})


# read, update and delete operations for events
class EventActionsAPIView(APIView):
    # get events from DB based on name
    @staticmethod
    def get(self, name):
        try:
            # data to be returned
            data = []
            # transform name to lowercase
            name = name.lower()

            events = Event.objects.raw('''SELECT * FROM explore_event WHERE LOWER(name) LIKE %s''', ['%' + name.lower() + '%'])

            if events:
                for event in events:
                    # add coordinates
                    lat, lng = get_coordinates(event.location)

                    data.append({'id': event.id, 'name': event.name, 'event_date': event.event_date, 'era': event.era,
                                 'location': event.location, 'description': event.description,
                                 "historical_period": event.historical_period.name,
                                 "event_type": event.event_type.name, "category": event.category.name,
                                 "event_type_id": event.event_type_id,
                                 "category_id": event.category_id,
                                 "latitude": lat,
                                 "longitude": lng})

            return JsonResponse({'data': data, 'status': status.HTTP_200_OK})
        except Event.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

    # edit event based on name
    def put(self, request, name):
        try:
            # data for update
            request_data = JSONParser().parse(request)
            # check if the data is safe
            forbidden_chars = ['!@#$%^&*:;']
            for key in ['name', 'location', 'event_type', 'category', 'description']:
                if any(char in forbidden_chars for char in request_data.get(key, '')):
                    return JsonResponse({'status': status.HTTP_500_INTERNAL_SERVER_ERROR})

            # get the ids of the fields
            category = Category.objects.raw('''SELECT id from explore_category WHERE LOWER(name) = %s''',
                                            [request_data['category'].lower()])
            event_type = EventType.objects.raw('''SELECT id from explore_eventtype WHERE LOWER(name) = %s''',
                                               [request_data['eventType'].lower()])
            # update event entry
            Event.objects.annotate(lower_name=Lower('name')).filter(lower_name=name.lower()).update(
                name=request_data['name'],
                location=request_data['location'],
                category_id=category[0].id,
                event_type_id=event_type[0].id,
                description=request_data['description'])

            return JsonResponse({'status': status.HTTP_200_OK})

        except Event.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

    # delete event based on name
    def delete(self, request, name):
        try:
            event = Event.objects.annotate(lower_name=Lower('name')).filter(lower_name=name.lower())
            # get all related videos and delete them first
            related_videos = Video.objects.filter(event_id=event[0].id)
            if related_videos:
                related_videos.delete()
            event.delete()
            return JsonResponse({'status': status.HTTP_200_OK})
        except Event.DoesNotExist:
            return JsonResponse({'status': status.HTTP_404_NOT_FOUND})


class AllEventTypesAPIView(APIView):
    # get all the event types from the database
    @staticmethod
    def get(self):
        types = EventType.objects.all()

        data = [{'id': t.id, 'name': t.name} for t in types]
        return JsonResponse({'data': data})


# API endpoint for configuring routes
class RoutesAPIView(APIView):
    # get all events that create a route based on some event info
    def get(self, request, category_id, event_type_id):
        events = Event.objects.raw('''SELECT e.*
                                    FROM explore_event e
                                    JOIN
                                    (SELECT id,
                                           extract(YEAR FROM event_date) * (-1) AS y,
                                           extract(MONTH FROM event_date) AS m,
                                           extract(DAY FROM event_date) AS d
                                    FROM explore_event
                                    WHERE era = 'BC'
                                    UNION
                                    SELECT id,
                                           extract(YEAR FROM event_date) AS y,
                                           extract(MONTH FROM event_date) AS m,
                                           extract(DAY FROM event_date) AS d
                                    FROM explore_event
                                    WHERE era = 'AD') e1
                                    ON e.ID = e1.ID
                                    WHERE event_type_id = %s and category_id = %s 
                                    ORDER BY e1.y, e1.m, e1.d ''',
                                    [event_type_id, category_id])
        if not events:
            return JsonResponse({'data': []})

        populate_map_location(events)

        # get the corresponding category to later access motto
        category = Category.objects.get(id=category_id)

        complete_events = [
            {
                'event': event,
                'latitude': map_location.latitude,
                'longitude': map_location.longitude
            }
            for event in events
            for map_location in MapLocation.objects.filter(name=event.location) if
            map_location.latitude and map_location.longitude
        ]

        data = [{'name': e['event'].name, 'event_date': e['event'].event_date, 'era': e['event'].era,
                 'location': e['event'].location, "historical_period": e['event'].historical_period.name,
                 "event_type": e['event'].event_type.name, "category": e['event'].category.name,
                 "event_type_id": e['event'].event_type_id, "category_id": e['event'].category_id,
                 "category_motto": category.motto, "latitude": e['latitude'], "longitude": e['longitude']}
                for e in complete_events]

        return JsonResponse({'data': data, 'status': status.HTTP_200_OK})


# API endpoint for grouping events into clusters
class ClusterEventsAPIView(APIView):
    # add a cluster to each event
    def put(self, request):
        # define number of clusters
        if len(request.data) < 100:
            k = 5
        else:
            k = 10

        # get latitude and longitude from all events in request
        events_coord = []

        try:
            for i in range(len(request.data)):
                # check if the format is correct
                forbidden_chars = ['!@#$%^&*:;']
                for char in forbidden_chars:
                    if char in request.data[i]['latitude'] or char in request.data[i]['longitude']:
                        return JsonResponse({'status': status.HTTP_500_INTERNAL_SERVER_ERROR})

                events_coord.append([request.data[i]['latitude'], request.data[i]['longitude']])

            # initialize k-Means clustering model
            kmeans = KMeans(n_clusters=k, n_init=3)
            # fit clustering model
            kmeans.fit(events_coord)
            # get clusters centers
            centroids = kmeans.cluster_centers_
            # get labels
            labels = kmeans.labels_

            # count number of elements in each cluster
            numbers = [0] * len(centroids)
            for i in range(len(centroids)):
                numbers[i] = list(labels).count(i)

            return JsonResponse({'centroids': centroids.tolist(), 'labels': labels.tolist(), 'numbers': numbers})

        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_400_BAD_REQUEST})
