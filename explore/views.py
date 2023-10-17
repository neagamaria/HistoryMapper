from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings


# view for the main page
def index(request):
    return HttpResponse("HistoryMapper")


# view for displaying a map
def display_map(request):
    context = {"google_api_key": settings.GOOGLE_API_KEY}
    return render(request, 'display_map.html', context)
