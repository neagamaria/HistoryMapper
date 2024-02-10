# models related to events

from django.db import models


# main model, info to be displayed on map
class Event(models.Model):
    name = models.CharField(max_length=100, unique=True)
    event_date = models.DateField()
    era = models.CharField(max_length=10)
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(verbose_name="Event Image", width_field=None, height_field=None, blank=True)
    # foreign keys
    historical_period = models.ForeignKey("HistoricalPeriod", on_delete=models.CASCADE)
    event_type = models.ForeignKey("EventType", on_delete=models.CASCADE)
    category = models.ManyToManyField("Category", related_name="categories", related_query_name="category", blank=True)
    tag = models.ManyToManyField("Tag", related_name="tags", related_query_name="tag", blank=True)
    historical_area = models.ForeignKey("HistoricalArea", on_delete=models.CASCADE, default=None)


# type of historical Event
class EventType(models.Model):
    TYPE_CHOICES = [('War', 'War'), ('Battle', 'Battle'), ('Invasion', 'Invasion'), ('Uprising', 'Uprising'),
                    ('Revolution', 'Revolution'), ('Human disaster', 'Human_disaster'),
                    ('Natural disaster', 'Natural_disaster'), ('Treaty', 'Treaty'), ('Truce', 'Truce'),
                    ('Discovery', 'Discovery'), ('Epidemic', 'Epidemic'), ('Succession', 'Succession'),
                    ('Social', 'Social'), ('Religious', 'Religious'), ('Cultural', 'Cultural')]

    name = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField()


# category of a historical event
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    motto = models.CharField(max_length=200, blank=True)


# tags for searching the event
class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)
