from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework.parsers import JSONParser

from rest_framework.response import Response
from rest_framework.views import APIView, status
from rest_framework.authtoken.models import Token

from explore.models import UserSerializer


# API endpoint for authentication system
class AuthenticationAPIView(APIView):
    # registration process
    def post(self, request):
        user_data = UserSerializer(data=request.data)
        if user_data.is_valid():
            # save user in db
            user_data.save()
            user = User.objects.get(username=request.data['username'])
            # hashed password
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": user_data.data, 'status': status.HTTP_200_OK})
        return JsonResponse({'status': status.HTTP_400_BAD_REQUEST})

    # login process
    def put(self, request):
        user = get_object_or_404(User, username=request.data['username'])
        if not user.check_password(request.data['password']):
            return Response({"error": "Incorrect password"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token, created = Token.objects.get_or_create(user=user)
            serializer = UserSerializer(instance=user)
            return JsonResponse({"token": token.key, "user": serializer.data, 'status': status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})


class UserAPIView(APIView):
    # get user by username
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            if not user:
                return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

            serializer = UserSerializer(instance=user)
            return JsonResponse({"user": serializer.data, 'status': status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})

    # edit user information
    def put(self, request, username):
        request_data = JSONParser().parse(request)

        try:
            user = User.objects.get(username=username)
            if not user:
                return JsonResponse({'status': status.HTTP_404_NOT_FOUND})

            # update data
            if request_data['password']:
                user.set_password(request_data['password'])

            if request_data['email']:
                user.email = request_data['email']

            if request_data['first_name']:
                user.first_name = request_data['first_name']

            if request_data['last_name']:
                user.last_name = request_data['last_name']

            user.save()

            serializer = UserSerializer(user)

            return JsonResponse({'user': serializer.data, 'status': status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})

    def delete(self, request, username):
        try:
            user = User.objects.get(username=username)
            if not user:
                return JsonResponse({'status': status.HTTP_404_NOT_FOUND})
            else:
                user.delete()
                return JsonResponse({'status': status.HTTP_204_NO_CONTENT})
        except Exception as e:
            return JsonResponse({'exception': str(e), 'status': status.HTTP_500_INTERNAL_SERVER_ERROR})



