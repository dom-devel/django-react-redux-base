# Django imports
from django.shortcuts import get_object_or_404
from django_rest_logger import log
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import CreateModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# Local imports
from accounts.models import User
from accounts.serializers import UserRegistrationSerializer, UserSerializer
from lib.utils import AtomicMixin
from accounts.utils import NoLoopBasicAuthentication

# Knox
from knox.auth import TokenAuthentication
from knox.views import LoginView as KnoxLoginView


class UserRegisterView(AtomicMixin, CreateModelMixin, GenericAPIView):
    serializer_class = UserRegistrationSerializer
    authentication_classes = ()

    def post(self, request):
        """User registration view."""
        return self.create(request)


class UserLoginView(KnoxLoginView):
    authentication_classes = [NoLoopBasicAuthentication]


# class UserLoginView(GenericAPIView):
#     serializer_class = UserSerializer
#     authentication_classes = (NoLoopBasicAuthentication,)
#     permission_classes = (IsAuthenticated,)

#     def post(self, request):
#         """User login with username and password."""
#         token = AuthToken.objects.create(request.user)
#         return Response(
#             {"user": self.get_serializer(request.user).data, "token": token}
#         )
