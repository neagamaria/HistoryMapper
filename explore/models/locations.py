# data related to physical localization of an event on map

from django.db import models


# the region in which events are found
class HistoricalArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
