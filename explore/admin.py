from django.contrib import admin
from .models import Event, EventType, Category, Tag, HistoricalArea, HistoricalPeriod, MapLocation

# register models here to be displayed on admin page
admin.site.register(Event)
admin.site.register(Category)
admin.site.register(EventType)
admin.site.register(Tag)
admin.site.register(HistoricalArea)
admin.site.register(HistoricalPeriod)
admin.site.register(MapLocation)
