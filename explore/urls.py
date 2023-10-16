from django.urls import path
from . import views

# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
    path("display_map", views.display_map, name="display_map")
]
