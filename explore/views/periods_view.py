from django.http import JsonResponse
from rest_framework.generics import get_object_or_404
from rest_framework.views import APIView
from rest_framework import status
from explore.models import HistoricalPeriod


# API endpoint for getting historical periods from the db
class HistoricalPeriodsAPIView(APIView):
    @staticmethod
    def get(request):
        historical_periods = HistoricalPeriod.objects.all()
        data = [{'id': period.id, 'name': period.name, 'start_year': period.start_year, 'end_year': period.end_year, 'era': period.era,
                 'description': period.description} for period in historical_periods]
        return JsonResponse({'data': data})


# API endpoint for getting a particular historical period based on id
class HistoricalPeriodAPIView(APIView):
    @staticmethod
    # get only one historical period, based on the id
    def get(request, period_id):
        historical_period = get_object_or_404(HistoricalPeriod, id=period_id)

        data = [{'name': historical_period.name, 'start_year': historical_period.start_year,
                 'end_year': historical_period.end_year, 'era': historical_period.era,
                 'description': historical_period.description}]

        return JsonResponse({'data': data, 'status': status.HTTP_200_OK})



