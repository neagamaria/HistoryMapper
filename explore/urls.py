from django.urls import path
from . import views
from django.views.generic import RedirectView

# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
    path("display_map", views.display_map, name="display_map"),
    path("display_tables", views.display_tables, name="display_tables"),
    path('api/historical-periods/', views.HistoricalPeriodsAPIView.as_view(), name='historical-places-api'),
]
