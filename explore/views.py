from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings


# Views created here
def index(request):
    return HttpResponse("HistoryMapper")


# View for displaying a map
def display_map(request):
    context = {"google_api_key": settings.GOOGLE_API_KEY}
    return render(request, 'display_map.html', context)