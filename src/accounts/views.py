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


class UserConfirmEmailView(AtomicMixin, GenericAPIView):
    serializer_class = None
    authentication_classes = ()

    def get(self, request, activation_key):
        """
        View for confirm email.

        Receive an activation key as parameter and confirm email.
        """
        user = get_object_or_404(User, activation_key=str(activation_key))
        if user.confirm_email():
            return Response(status=status.HTTP_200_OK)

        log.warning(
            message="Email confirmation key not found.",
            details={"http_status_code": status.HTTP_404_NOT_FOUND},
        )
        return Response(status=status.HTTP_404_NOT_FOUND)


class UserEmailConfirmationStatusView(GenericAPIView):
    serializer_class = None
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        """Retrieve user current confirmed_email status."""
        user = self.request.user
        return Response({"status": user.confirmed_email}, status=status.HTTP_200_OK)
