# data related to physical localization of an event on map

from django.db import models


# the region in which events are found
class HistoricalArea(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)


# the locations with their coordinates
class MapLocation(models.Model):
    name = models.CharField(max_length=100, unique=True)
    latitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, blank=True)
