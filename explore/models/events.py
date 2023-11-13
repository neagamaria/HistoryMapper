# models related to events

from django.db import models


# main model, info to be displayed on map
class Event(models.Model):
    name = models.CharField(max_length=100, unique=True)
    date = models.DateTimeField()
    era = models.CharField(max_length=10)
    description = models.TextField(blank=True)
    image = models.ImageField(verbose_name="Event Image", width_field=None, height_field=None, blank=True)
    # foreign keys
    historical_period = models.ForeignKey("HistoricalPeriod", on_delete=models.CASCADE)
    location = models.ForeignKey("Location", on_delete=models.CASCADE)
    event_type = models.ForeignKey("EventType", on_delete=models.CASCADE)
    tag = models.ManyToManyField("Tag", related_name="tags", related_query_name="tag", blank=True)


class MilitaryEvent(Event):
    commanders = models.TextField()
    winner = models.CharField(max_length=100)
    casualties = models.BigIntegerField()
    strategy = models.TextField(blank=True)


# category for a historical event
class EventType(models.Model):
    TYPE_CHOICES = [('War', 'War'), ('Battle', 'Battle'), ('Invasion', 'Invasion'), ('Uprising', 'Uprising'),
                    ('Revolution', 'Revolution'), ('Human disaster', 'Human_disaster'),
                    ('Natural disaster', 'Natural_disaster'), ('Treaty', 'Treaty'), ('Truce', 'Truce'),
                    ('Discovery', 'Discovery'), ('Epidemic', 'Epidemic'), ('Succession', 'Succession'),
                    ('Social', 'Social'), ('Religious', 'Religious')]

    name = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField()


# tags for searching the events
class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)
