from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Quiz(models.Model):
    title = models.CharField(unique=True, max_length=200)


# quiz questions displayed for users
class Question(models.Model):
    description = models.TextField()
    answer1 = models.TextField()
    answer2 = models.TextField()
    answer3 = models.TextField()
    answer4 = models.TextField()
    correct_answer = models.SmallIntegerField(default=1, validators=[MaxValueValidator(4), MinValueValidator(1)])
    # foreign key
    quiz = models.ForeignKey("Quiz", on_delete=models.CASCADE)
