import rest_framework
from django.urls import path, include
from . import views

# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
    path("display-map", views.display_map, name="display-map"),
    path("display-tables", views.display_tables, name="display-tables"),
    path('api/historical-periods/', views.HistoricalPeriodsAPIView.as_view(), name='historical-periods-api'),
    path('api/historical-periods/<str:period_id>', views.HistoricalPeriodAPIView.as_view(), name='historical-period-info-api'),
    path('api/events-between-<int:start_year>-<str:start_era>-<int:end_year>-<str:end_era>',
         views.EventsBetweenYearsAPIView.as_view(), name="events-between-years-api"),
    path('api/registration/', views.RegistrationAPI.as_view(), name="registration-api"),
    path('api/login/', views.LoginAPI.as_view(), name="login-api"),
    path('api/quizzes', views.QuizzesAPIView.as_view(), name="quizzes-api"),
    path('api/questions/<str:quiz_id>', views.QuestionsAPIView.as_view(), name="questions-api")
]
