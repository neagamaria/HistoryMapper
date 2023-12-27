import requests
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.db import connection
from .models import HistoricalPeriod, Event, MapLocation
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core import serializers


# view for the main page
def index(request):
    return HttpResponse("HistoryMapper")


# view for displaying a map
def display_map(request):
    context = {"google_api_key": settings.GOOGLE_API_KEY}
    return render(request, 'display_map.html', context)


# TODO delete/ alter this view
def display_tables(request):
    historical_periods = HistoricalPeriod.objects.all()
    context = {'historical_periods': historical_periods}
    return render(request, 'display_tables.html', context)


# API for retrieving historical periods from the db
class HistoricalPeriodsAPIView(APIView):
    @staticmethod
    def get(request):
        historical_periods = HistoricalPeriod.objects.all()
        data = [{'name': period.name, 'start_year': period.start_year, 'end_year': period.end_year, 'era': period.era,
                 'description': period.description} for period in historical_periods]
        return JsonResponse({'data': data})


# API for retrieving events from a given period from the db
class EventsBetweenYearsAPIView(APIView):
    # function that calls the Geocoding API
    @staticmethod
    def get_coordinates(self, location):
        url = f"https://maps.googleapis.com/maps/api/geocode/json?key={settings.GOOGLE_API_KEY}&address={location}"
        response = requests.get(url)
        data = response.json()

        if data['status'] == "OK":
            coordinates = data['results'][0]['geometry']['location']
            return coordinates['lat'], coordinates['lng']

    # function that obtains needed locations and adds entries in the db
    @staticmethod
    def populate_map_location(self, events):
        # get all events' locations that do not have entries in the db
        all_event_locations = set(event.location for event in events)
        map_locations = set(MapLocation.objects.raw('''SELECT id, name FROM explore_maplocation'''))
        all_map_locations = set(location.name for location in map_locations)
        new_locations = all_event_locations.difference(all_map_locations)

        # populate the MapLocation table with names and coordinates
        for location in new_locations:
            lat, lng = self.get_coordinates(self, location)
            MapLocation.objects.create(
                name=location,
                latitude=lat,
                longitude=lng
            )

    # get all events in a time period and their coordinates
    def get(self, request, start_year, start_era, end_year, end_era):
        if start_era == 'BC':
            start_year = -start_year
        if end_era == 'BC':
            end_year = -end_year

        events = Event.objects.raw('''SELECT * FROM explore_event
                                    WHERE (era = 'BC' AND -1 * EXTRACT(YEAR FROM event_date)  >=  %s AND -1 * EXTRACT(YEAR FROM event_date) <= -1 * %s)
                                    OR (era = 'AD' AND EXTRACT(YEAR FROM event_date) >= %s AND EXTRACT(YEAR FROM event_date) <= %s)''',
                                   [start_year, end_year, start_year, end_year])

        self.populate_map_location(self, events)

        complete_events = [
            {
                'event': event,
                'latitude': map_location.latitude,
                'longitude': map_location.longitude
            }
            for event in events
            for map_location in MapLocation.objects.filter(name=event.location)
        ]

        data = [{'name': e['event'].name, 'event_date': e['event'].event_date, 'era': e['event'].era,
                 'location': e['event'].location, 'description': e['event'].description,
                 "historical_period": e['event'].historical_period.name, "event_type": e['event'].event_type.name,
                 "category": e['event'].category.name, "tags": e['event'].tag.name,
                 "historical_area": e['event'].historical_area.name, "latitude": e['latitude'],
                 "longitude": e['longitude']}
                for e in complete_events]

        return JsonResponse({'data': data})
