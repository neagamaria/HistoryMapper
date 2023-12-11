from django.urls import path
from . import views
from django.views.generic import RedirectView

# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
    path("display-map", views.display_map, name="display-map"),
    path("display-tables", views.display_tables, name="display-tables"),
    path('api/historical-periods/', views.HistoricalPeriodsAPIView.as_view(), name='historical-places-api'),
    path('api/events-between-<int:start_year>-<str:start_era>-<int:end_year>-<str:end_era>',
         views.EventsBetweenYearsAPIView.as_view(), name="events-between-years-api")
]
