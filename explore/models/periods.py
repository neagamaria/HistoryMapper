from django.db import models


# periods that contain the historical events
class HistoricalPeriod(models.Model):
    name = models.CharField(max_length=100)
    start_year = models.SmallIntegerField(blank=True)
    end_year = models.SmallIntegerField(null=True, blank=True)
    era = models.CharField(max_length=10)
    description = models.TextField(blank=True)
