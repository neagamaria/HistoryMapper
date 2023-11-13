# data related to physical localization of an event on map

from django.db import models


class Location(models.Model):
    name = models.CharField(max_length=100)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    # foreign key
    historical_area = models.ForeignKey("HistoricalArea", on_delete=models.CASCADE)


# the region in which locations are found
class HistoricalArea(models.Model):
    name = models.CharField(max_length=100)
    actual_name = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)