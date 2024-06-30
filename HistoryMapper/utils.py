from explore.models import APIKeys


# function to get the Google API Key
def get_google_api_key():
    google_credentials = APIKeys.objects.raw('''SELECT * FROM explore_apikeys WHERE service_name = %s''', ['Google'])
    return google_credentials[0].key


GOOGLE_API_KEY = get_google_api_key()
