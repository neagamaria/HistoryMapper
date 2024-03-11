from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse
from rest_framework.views import APIView
from explore.models import Event, EventType, HistoricalPeriod, Category

from HistoryMapper import settings
import requests


# API endpoint for populating DB with info from Wikipedia DB
class DBPediaAPIView(APIView):
    # get data from Wikipedia
    @staticmethod
    def get_dbpedia_data(self, wiki_category):
        sparql_endpoint = "http://dbpedia.org/sparql"
        sparql = SPARQLWrapper(sparql_endpoint)

        sparql_query = f"""
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX dbp: <http://dbpedia.org/property/>

        SELECT DISTINCT ?event ?eventLabel ?eventDate ?eventShortDesc ?latitude ?longitude ?place
        WHERE {{
            ?event dct:subject <http://dbpedia.org/resource/Category:{wiki_category}>. 

            ?event rdfs:label ?eventLabel .
            ?event dbo:date ?eventDate .
            ?event dbo:abstract ?eventShortDesc .

            OPTIONAL {{
                ?event geo:lat ?latitude .
            }}

            OPTIONAL {{
                ?event geo:long ?longitude .
            }}

            OPTIONAL {{
                ?event dbo:place ?place .
            }}

            FILTER (LANG(?eventLabel) = 'en')
            FILTER (LANG(?eventShortDesc) = 'en')
        }}
        ORDER BY ?eventDate"""

        sparql.setQuery(sparql_query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()

        return results

    # obtain location based on latitude and longitude - reverse geocoding
    @staticmethod
    def get_location(self, lat, lng):
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lng}&key={settings.GOOGLE_API_KEY}"
        response = requests.get(url)
        data = response.json()
        locality = ''
        country = ''

        for item in data['results'][0]['address_components']:
            if item['types'][0] == 'locality':
                locality = item['long_name']

            if item['types'][0] == 'country':
                country = item['short_name']

        location = locality + ',' + country

        return location

    # add data to database
    def get(self, wiki):
        wiki_category = "Battles_involving_Moldavia"
        event_type = "Battle"
        data = []

        # get all data from Dbpedia API
        results = self.get_dbpedia_data(self, wiki_category)
        event_type = EventType.objects.raw('''SELECT id FROM explore_eventtype WHERE
                                                name = %s''', [event_type])

        event_type_id = event_type[0].id

        # get fields for each event
        for result in results["results"]["bindings"]:
            # name
            event_label = result["eventLabel"]["value"]
            # date
            event_date = result["eventDate"]["value"]
            # description
            event_desc = result["eventShortDesc"]["value"]
            # coordinates
            if "latitude" in result:
                event_lat = result["latitude"]["value"]
            else:
                event_lat = ""

            if "longitude" in result:
                event_lng = result["longitude"]["value"]
            else:
                event_lng = ""

            # TODO create logic for places not represented as latitude and longitude coordinates
            if event_lng != "" and event_lat != "":
                # test if event already exists
                year, month, day = event_date.split('-')
                db_events = Event.objects.raw('''SELECT id FROM explore_event WHERE
                                                name = %s AND EXTRACT(YEAR FROM event_date) = %s
                                                AND EXTRACT(MONTH FROM event_date) = %s
                                                AND EXTRACT(DAY FROM event_date) = %s''',
                                              [event_label, year, month, day])
                if db_events:
                    continue

                # TODO make logic for 'BC' events as well
                # find historical period for event
                historical_period = HistoricalPeriod.objects.raw('''SELECT id FROM explore_historicalperiod
                                                                    WHERE era = 'AD' AND %s BETWEEN start_year
                                                                    AND end_year''', [year])
                historical_period_id = historical_period[0].id

                # get location based on coordinates
                event_location = self.get_location(self, event_lat, event_lng)

                categ = "Moldavia"

                event_category = Category.objects.raw('''SELECT id FROM explore_category
                                                       WHERE name = %s''', [categ])

                # insert category in db if it doesn't already exist
                if not event_category:
                    category_to_insert = Category(name=categ)
                    category_to_insert.save()
                    event_category = Category.objects.raw('''SELECT id FROM explore_category
                                                            WHERE name = %s''', [categ])
                event_category_id = event_category[0].id

                if event_location != '':
                    event = {'name': event_label, 'event_date': event_date,
                             'era': 'AD', 'location': event_location, 'description': event_desc,
                             'historical_period': historical_period_id, 'event_type': event_type_id,
                             'event_category': event_category_id
                             }

                    data.append(event)

                    # insert raw into DB
                    # raw = Event(name=event_label, event_date=event_date, era='AD', location=event_location,
                    #             description=event_desc, historical_period_id=historical_period_id,
                    #             event_type_id=event_type_id, category_id=event_category_id)
                    # raw.save()

        return JsonResponse({'data': data})
