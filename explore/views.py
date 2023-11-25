from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings
from django.db import connection
from .models import HistoricalPeriod, HistoricalPeriodSerializer
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
        historical_periods = serializers.serialize('json', HistoricalPeriod.objects.all())
        return Response({'data':historical_periods})
