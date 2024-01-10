from django.http import JsonResponse
from rest_framework.views import APIView

from explore.models import HistoricalPeriod


# API endpoint for getting historical periods from the db
class HistoricalPeriodsAPIView(APIView):
    @staticmethod
    def get(request):
        historical_periods = HistoricalPeriod.objects.all()
        data = [{'name': period.name, 'start_year': period.start_year, 'end_year': period.end_year, 'era': period.era,
                 'description': period.description} for period in historical_periods]
        return JsonResponse({'data': data})
