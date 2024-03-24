from SPARQLWrapper import SPARQLWrapper, JSON
from django.http import JsonResponse
from rest_framework.views import APIView
from explore.models import Event, EventType, HistoricalPeriod, Category, MapLocation

from HistoryMapper import settings
import requests


# API endpoint for populating DB with info from DBPedia
class DBPediaAPIView(APIView):
    # get battles from DBPedia
    @staticmethod
    def get_dbpedia_battles(self, wiki_category):
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

    # get treaties from DBPedia
    @staticmethod
    def get_dbpedia_treaties(self, wiki_category):
        sparql_endpoint = "http://dbpedia.org/sparql"
        sparql = SPARQLWrapper(sparql_endpoint)

        sparql_query = f"""
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX yago: <http://dbpedia.org/class/yago/>
        PREFIX dbp: <http://dbpedia.org/property/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dct: <http://purl.org/dc/terms/>
        
        SELECT DISTINCT ?event, ?eventLabel, ?eventShortDesc, ?eventDate, ?locationSigned
        WHERE {{
              {{
                  ?event rdf:type yago:Treaty106773434 .
                  ?event dct:subject <http://dbpedia.org/resource/Category:{wiki_category}> . 
              }}
              
              ?event rdfs:label ?eventLabel .

            OPTIONAL {{
                ?event dbo:abstract ?eventShortDesc .
                FILTER (LANG(?eventShortDesc) = 'en')
            }}

            OPTIONAL {{
                ?event dbp:dateSigned ?eventDate .
            }}

            OPTIONAL {{
                ?event dbp:locationSigned ?locationSigned .
                FILTER (LANG(?locationSigned) = 'en')
            }}

            FILTER (LANG(?eventLabel) = 'en')
        }}
        """

        sparql.setQuery(sparql_query)
        sparql.setReturnFormat(JSON)
        results = sparql.query().convert()
        
        data = {'bindings': []}

        event = ""
        for result in results["results"]["bindings"]:
            event_label = result["eventLabel"]["value"]

            if event == event_label:
                event = event_label
                continue

            event_date = ""
            if "eventDate" in result:
                event_date = result["eventDate"]["value"]
            event_location = ""

            if "locationSigned" in result:
                event_location = result["locationSigned"]["value"]

            if event_location == "" and event_date == "":
                if "(" in event_label:
                    if "Treaty of" in event_label or "Convention" in event_label:
                        label = event_label.replace("Treaty of ", "").replace("Convention ", "")
                        comp = label.split("(")
                        event_location = comp[0].replace(" ", "")
                        year = comp[1].replace(")", "").replace(" ", "")
                        event_date = year + "-01-01"

                        if 'eventDate' not in result:
                            result['eventDate'] = {'value': event_date}
                        else:
                            result['eventDate']['value'] = event_date

            if event_location != '':
                sparql_location_query = ("""
                        PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

                        SELECT DISTINCT ?latitude ?longitude
                        WHERE {
                            <http://dbpedia.org/resource/""" +
                                         str(event_location).replace(' ', '_') + """>
                                geo:lat ?latitude ;
                                geo:long ?longitude .
                        }
                """)

                sparql.setQuery(sparql_location_query)
                sparql.setReturnFormat(JSON)
                locations = sparql.query().convert()

                for location in locations["results"]["bindings"]:
                    if "latitude" in location:
                        event_lat = location["latitude"]["value"]
                        if 'latitude' not in result:
                            result['latitude'] = {'value': event_lat}
                        else:
                            result['latitude']['value'] = event_lat
                    else:
                        continue

                    if "longitude" in location:
                        event_long = location["longitude"]["value"]
                        if 'longitude' not in result:
                            result['longitude'] = {'value': event_long}
                        else:
                            result['longitude']['value'] = event_long
                    else:
                        continue
                        
                    if event_date != '' and event_location != '' and event_lat != '' and event_long != '':
                        data['bindings'].append(result)
        res = {'results': data}
        return res

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
    def get(self, response, wiki_category, event_type, categ):
        data = []

        # get events of given type from Dbpedia API
        if event_type == 'Battle':
            results = self.get_dbpedia_battles(self, wiki_category)
        elif event_type == 'Treaty':
            results = self.get_dbpedia_treaties(self, wiki_category)

        event_type = EventType.objects.raw('''SELECT id FROM explore_eventtype WHERE
                                                name = %s''', [event_type])

        event_type_id = event_type[0].id

        # get fields for each event
        for result in results["results"]["bindings"]:
            # name
            event_label = result["eventLabel"]["value"]
            # date
            if "eventDate" not in result:
                continue
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
                # split date
                date_comp = event_date.split('-')
                if date_comp[0] == '':
                    year = '-' + date_comp[1]
                    month = date_comp[2]
                    day = date_comp[3]
                else:
                    year = date_comp[0]
                    month = date_comp[1]
                    day = date_comp[2]

                # test if current event is already in the database
                db_events = Event.objects.raw('''SELECT id FROM explore_event WHERE
                                                name = %s''', [event_label])

                if len(list(db_events)) == 0:
                    # find historical period for event
                    historical_period_id = 0
                    if int(year) < 0:
                        year = -1 * int(year)
                        event_era = 'BC'
                        historical_period = HistoricalPeriod.objects.raw('''SELECT id 
                                                                            FROM explore_historicalperiod
                                                                            WHERE ((era = 'BC' AND %s BETWEEN end_year
                                                                            AND start_year) OR (era = 'BC - AD' AND %s BETWEEN 0
                                                                            AND start_year))''', [year, year])
                        historical_period_id = historical_period[0].id

                    else:
                        event_era = 'AD'
                        historical_period = HistoricalPeriod.objects.raw('''SELECT id FROM explore_historicalperiod
                                                                            WHERE (era = 'AD' AND ((%s BETWEEN start_year AND end_year ) 
                                                                            OR (%s >= start_year AND end_year is null)))
                                                                            OR (era = 'BC - AD' AND %s BETWEEN 0 AND end_year)''',
                                                                           [year, year, year])
                        historical_period_id = historical_period[0].id

                    if historical_period_id != 0:
                        # get location based on coordinates
                        event_location = self.get_location(self, event_lat, event_lng)

                        if event_location[0] == ',':
                            continue

                        event_category = Category.objects.raw('''SELECT id FROM explore_category
                                                               WHERE name = %s''', [categ])

                        # insert category in db if it doesn't already exist
                        if not event_category:
                            category_to_insert = Category(name=categ)
                            category_to_insert.save()
                            event_category = Category.objects.raw('''SELECT id FROM explore_category
                                                                    WHERE name = %s''', [categ])
                        event_category_id = event_category[0].id

                        event_date = str(year) + '-' + month + '-' + day

                        if event_location != '':
                            event = {'name': event_label, 'event_date': event_date,
                                     'era': event_era, 'location': event_location, 'description': event_desc,
                                     'historical_period': historical_period_id, 'event_type': event_type_id,
                                     'event_category': event_category_id
                                     }

                            if event not in data:
                                data.append(event)

                            # insert raw into DB
                            raw = Event(name=event_label, event_date=event_date, era=event_era, location=event_location,
                                        description=event_desc, historical_period_id=historical_period_id,
                                        event_type_id=event_type_id, category_id=event_category_id)
                            raw.save()

        return JsonResponse({'data': data})
