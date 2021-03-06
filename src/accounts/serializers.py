from rest_framework import serializers

from accounts.models import User
from lib.utils import validate_email as email_is_valid

from djoser.serializers import UserCreateSerializer


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email", "first_name", "last_name")


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("email",)


class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = ("id", "email", "name", "password")

    def create(self, validated_data):
        """
        Create the object.

        :param validated_data: string
        """
        user = User.objects.create(**validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user


class CustomUserCreateSerializer(UserCreateSerializer):
    """ Add name to serialiser for user. Djoser doesn't uses REQUIRED_FIELDS
    so we have to add this ourselves.

    This will also affect superuser.
    """

    class Meta:
        model = User
        fields = tuple(User.REQUIRED_FIELDS) + (
            User.USERNAME_FIELD,
            User._meta.pk.name,
            "password",
            "name",
        )


# def validate_email(self, value):
#     """
#     Validate if email is valid or there is an user using the email.

#     :param value: string
#     :return: string
#     """

#     if not email_is_valid(value):
#         raise serializers.ValidationError(
#             "Please use a different email address provider."
#         )

#     if User.objects.filter(email=value).exists():
#         raise serializers.ValidationError(
#             "Email already in use, please use a different email address."
#         )

#     return value
