from django.db import models


# historical period events are labeled to
class HistoricalPeriod(models.Model):
    name = models.CharField(max_length=100)
    start_year = models.SmallIntegerField()
    end_year = models.SmallIntegerField()
    era = models.CharField(max_length=10)