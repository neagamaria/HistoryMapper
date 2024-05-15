from django.db import models
from django.contrib.auth.models import User


# data related to quiz history for users
class QuizHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey("Category", on_delete=models.CASCADE)
    last_score = models.IntegerField()