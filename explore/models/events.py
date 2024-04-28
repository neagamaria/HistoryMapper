from django.db import models


# main model, info to be displayed on map
class Event(models.Model):
    name = models.CharField(max_length=100, unique=True)
    event_date = models.DateField()
    era = models.CharField(max_length=10)
    location = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    # foreign keys
    historical_period = models.ForeignKey("HistoricalPeriod", on_delete=models.CASCADE)
    event_type = models.ForeignKey("EventType", on_delete=models.CASCADE)
    category = models.ForeignKey("Category", on_delete=models.CASCADE, blank=True)


# type of historical Event
class EventType(models.Model):
    TYPE_CHOICES = [('War', 'War'), ('Battle', 'Battle'), ('Invasion', 'Invasion'), ('Uprising', 'Uprising'),
                    ('Revolution', 'Revolution'), ('Siege', 'Siege'), ('Human disaster', 'Human_disaster'),
                    ('Natural disaster', 'Natural_disaster'), ('Treaty', 'Treaty'), ('Truce', 'Truce'),
                    ('Discovery', 'Discovery'), ('Epidemic', 'Epidemic'), ('Succession', 'Succession'),
                    ('Social', 'Social'), ('Religious', 'Religious'), ('Cultural', 'Cultural')]

    name = models.CharField(max_length=30, choices=TYPE_CHOICES)
    description = models.TextField()


# category of a historical event
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    motto = models.CharField(max_length=200, blank=True)

