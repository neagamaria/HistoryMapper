from django.urls import path
from . import views


# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
]
