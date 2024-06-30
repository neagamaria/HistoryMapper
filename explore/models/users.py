from django.contrib.auth.models import User
from rest_framework import serializers


# serializer for the django user model
class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'is_superuser']
