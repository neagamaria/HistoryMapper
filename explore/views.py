from django.shortcuts import render
from django.http import HttpResponse


# Views created here
def index(request):
    return HttpResponse("HistoryMapper")
