from django.http import HttpResponse


# view for the main page
def index(request):
    return HttpResponse("HistoryMapper")
