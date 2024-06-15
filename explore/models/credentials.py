from django.db import models


# model for storing api keys
class APIKeys(models.Model):
    service_name = models.CharField(max_length=100)
    key = models.CharField(max_length=100)