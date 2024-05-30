from googleapiclient.discovery import build
from rest_framework import status
from rest_framework.views import APIView
from django.http import JsonResponse

from HistoryMapper import settings
from explore.models import Event, Video


class VideosAPIView(APIView):
    # get all available YouTube videos for an event
    def put(self, request, event_name):
        try:
            # find the id of the event
            event = Event.objects.raw('''SELECT id FROM explore_event WHERE name = %s''', [event_name])
            event_id = event[0].id
            videos = []

            # check if event has videos in the db
            existing_videos = Video.objects.raw('''SELECT * FROM explore_video WHERE event_id=%s''', [event_id])

            if existing_videos:
                for video in existing_videos:
                    videos.append({
                        'name': video.name,
                        'url': video.url,
                        'id': video.id,
                        'image': video.image
                    })

            else:
                # call the YouTube API
                youtube = build('youtube', 'v3', developerKey=settings.GOOGLE_API_KEY)
                request = youtube.search().list(
                    q=event_name,
                    part='snippet',
                    maxResults=5,
                    type='video'
                )
                response = request.execute()

                # create a list of videos
                for video in response.get('items', []):
                    name, url = video['snippet']['title'], f"https://www.youtube.com/watch?v={video['id']['videoId']}"
                    image = video['snippet']['thumbnails']['medium']['url']

                    raw = Video(name=name, url=url, event_id=event_id, image=image)
                    raw.save()
                    videos.append({
                        'name': name,
                        'url': url,
                        'id': video['id']['videoId'],
                        'image': str(image)
                    })

            return JsonResponse({'data': videos, 'status': status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})
