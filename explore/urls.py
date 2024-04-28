import rest_framework
from django.urls import path
from . import views

# URLs for the explore app
urlpatterns = [
    path("", views.index, name="index"),
    path('api/historical-periods/', views.HistoricalPeriodsAPIView.as_view(), name='historical-periods-api'),
    path('api/historical-periods/<str:period_id>', views.HistoricalPeriodAPIView.as_view(),
         name='historical-period-info-api'),
    path('api/events-between-<int:start_year>-<str:start_era>-<int:end_year>-<str:end_era>',
         views.EventsBetweenYearsAPIView.as_view(), name="events-between-years-api"),
    path('api/event-by-name-<str:name>', views.EventActionsAPIView.as_view(), name="event-by-name-api"),
    path('api/registration/', views.RegistrationAPI.as_view(), name="registration-api"),
    path('api/login/', views.LoginAPI.as_view(), name="login-api"),
    path('api/dbpedia/<str:wiki_category>/<str:event_type>/<str:categ>', views.DBPediaAPIView.as_view(),
         name="dbpedia-info-api"),
    path('api/all-types/', views.AllEventTypesAPIView.as_view(), name="all-types"),
    path('api/routes/<str:category_id>/<event_type_id>/', views.RoutesAPIView.as_view(), name="routes-api"),
    path('api/categories', views.CategoriesAPIView.as_view(), name="categories-api"),
    path('api/quiz/<str:category_id>', views.QuizAPIView.as_view(), name="quiz-api"),
    path('api/quiz-history', views.QuizHistoryAPIView.as_view(), name="quiz-history-api")
]
