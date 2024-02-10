from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404

from rest_framework.response import Response
from rest_framework.views import APIView, status
from rest_framework.authtoken.models import Token

from explore.models import UserSerializer


# API endpoint for registration
class RegistrationAPI(APIView):
    # registration process
    @staticmethod
    def post(request):
        user_data = UserSerializer(data=request.data)
        if user_data.is_valid():
            # save user in db
            user_data.save()
            user = User.objects.get(username=request.data['username'])
            # hashed password
            user.set_password(request.data['password'])
            user.save()
            token = Token.objects.create(user=user)
            return Response({"token": token.key, "user": user_data.data})
        return Response(user_data.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPI(APIView):
    # login process
    @staticmethod
    def post(request):
        user = get_object_or_404(User, username=request.data['username'])
        if not user.check_password(request.data['password']):
            return Response({"detail": "User not found"}, status=status.HTTP_400_BAD_REQUEST)

        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({"token": token.key, "user": serializer.data})

