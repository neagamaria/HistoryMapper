# API for retrieving events from a given period from the db
import requests
from django.http import JsonResponse
from rest_framework.views import APIView

from HistoryMapper import settings
from explore.models import MapLocation, Event, EventType


# call the Gocoding API
def get_coordinates(location):
    url = f"https://maps.googleapis.com/maps/api/geocode/json?key={settings.GOOGLE_API_KEY}&address={location}"
    response = requests.get(url)
    data = response.json()

    if data['status'] == "OK":
        coordinates = data['results'][0]['geometry']['location']
        return coordinates['lat'], coordinates['lng']

    return 0, 0


# obtain needed locations and add entries in the db
def populate_map_location(events):
    # get all events' locations that do not have entries in the db
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


# API endpoints for getting events from the db and displaying them on map
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
                 "latitude": e['latitude'],
                 "longitude": e['longitude']}
                for e in complete_events]

        return JsonResponse({'data': data})


class EventByNameAPIView(APIView):
    # get one event from DB based on name
    @staticmethod
    def get(self, name):
        # data to be returned
        data = []
        # transform name to lowercase
        name = name.lower()

        event = Event.objects.raw('''SELECT * FROM explore_event WHERE LOWER(name) = %s''', [name])

        if event:
            event = event[0]
            # add coordinates
            lat, lng = get_coordinates(event.location)

            data = [{'name': event.name, 'event_date': event.event_date, 'era': event.era,
                     'location': event.location, 'description': event.description,
                     "historical_period": event.historical_period.name,
                     "event_type": event.event_type.name, "category": event.category.name,
                     "latitude": lat,
                     "longitude": lng}]

        return JsonResponse({'data': data})


class AllEventTypesAPIView(APIView):
    # get all the event types from the database
    @staticmethod
    def get(self):
        types = EventType.objects.all()

        data = [{'id': t.id, 'name': t.name} for t in types]
        return JsonResponse({'data': data})


class RoutesAPIView(APIView):
    # get all events that create a route based on some event info
    @staticmethod
    def get(self, category_id, event_type_id):
        events = Event.objects.raw('''SELECT * FROM explore_event WHERE event_type_id = %s and category_id = %s 
                                    ORDER BY event_date ''',
                                   [event_type_id, category_id])
        if not events:
            return JsonResponse({'data': []})

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
                 "category": e['event'].category.name,
                 "latitude": e['latitude'],
                 "longitude": e['longitude']}
                for e in complete_events]

        return JsonResponse({'data': data})
