from django.contrib import admin
from .models import Event, EventType, Category, HistoricalPeriod, MapLocation, Video
from django.contrib.auth.models import User

# register models here to be displayed on admin page
admin.site.register(Event)
admin.site.register(Category)
admin.site.register(EventType)
admin.site.register(HistoricalPeriod)
admin.site.register(MapLocation)
admin.site.register(Video)
