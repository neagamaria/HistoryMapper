from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from django.db import connection
from .models import HistoricalPeriod, Event
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
    def get(self, request):
        historical_periods = HistoricalPeriod.objects.all()
        data = [{'name': period.name, 'start_year': period.start_year, 'end_year': period.end_year, 'era': period.era,
                 'description': period.description} for period in historical_periods]
        return JsonResponse({'data': data})


# API for retrieving events from a given period from the db
class EventsBetweenYearsAPIView(APIView):
    def get(self, request, start_year, start_era, end_year, end_era):
        if start_era == 'BC':
            start_year = -start_year
        if end_era == 'BC':
            end_year = -end_year

        events = Event.objects.raw('''SELECT * FROM explore_event
                                    WHERE (era = 'BC' AND -1 * EXTRACT(YEAR FROM event_date)  >=  %s AND -1 * EXTRACT(YEAR FROM event_date) <= -1 * %s)
                                    OR (era = 'AD' AND EXTRACT(YEAR FROM event_date) >= %s AND EXTRACT(YEAR FROM event_date) <= %s)''',
                                   [start_year, end_year, start_year, end_year])
        print(events.__len__())
        data = [{'name': event.name, 'event_date': event.event_date, 'era': event.era, 'location': event.location,
                 'description': event.description, "historical_period": event.historical_period.name,
                 "event_type": event.event_type.name, "category": event.category.name, "tags": event.tag.name, "historical_area": event.historical_area.name} for event in events]

        return JsonResponse({'data': data})


