from django.contrib import admin
from .models import Event, MilitaryEvent, EventType, Tag, Location, HistoricalArea, HistoricalPeriod

# register models here to be displayed on admin page
admin.site.register(Event)
admin.site.register(MilitaryEvent)
admin.site.register(EventType)
admin.site.register(Tag)
admin.site.register(Location)
admin.site.register(HistoricalArea)
admin.site.register(HistoricalPeriod)
