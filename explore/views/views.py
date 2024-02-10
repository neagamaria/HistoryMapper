import requests
from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings


from explore.models import HistoricalPeriod


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









