import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _


class MyUserManager(BaseUserManager):
    def _create_user(
        self, email, password, name, is_staff, is_superuser, **extra_fields
    ):
        """
        Create and save an User with the given email, password, name and phone number.

        :param email: string
        :param password: string
        :param name: string
        :param is_staff: boolean
        :param is_superuser: boolean
        :param extra_fields:
        :return: User
        """
        now = timezone.now()
        email = self.normalize_email(email)
        user = self.model(
            email=email,
            name=name,
            is_staff=is_staff,
            is_active=True,
            is_superuser=is_superuser,
            last_login=now,
            date_joined=now,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        return user

    def create_user(self, email, name, password, **extra_fields):
        """
        Create and save an User with the given email, password and name.

        :param email: string
        :param name: string
        :param password: string
        :param extra_fields:
        :return: User
        """

        return self._create_user(
            email, password, name, is_staff=False, is_superuser=False, **extra_fields
        )

    def create_superuser(self, email, name="", password=None, **extra_fields):
        """
        Create a super user.

        :param email: string
        :param name: string
        :param password: string
        :param extra_fields:
        :return: User
        """
        return self._create_user(
            email, password, name, is_staff=True, is_superuser=True, **extra_fields
        )


class User(AbstractUser):
    """
    Model that represents an user.

    Djoser requires any user that is created to have validated an email.

    https://www.fomfus.com/articles/how-to-use-email-as-username-for-django-authentication-removing-the-username
    """

    username = None
    first_name = None
    last_name = None
    name = models.CharField(_("Name"), max_length=50)
    email = models.EmailField(_("Email address"), unique=True)

    confirmed_email = models.BooleanField(default=False)

    is_staff = models.BooleanField(_("staff status"), default=False)
    is_superuser = models.BooleanField(_("superuser status"), default=False)
    is_active = models.BooleanField(_("active"), default=True)

    date_joined = models.DateTimeField(_("date joined"), auto_now_add=True)
    date_updated = models.DateTimeField(_("date updated"), auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name"]

    objects = MyUserManager()

    def __str__(self):
        """
        Unicode representation for an user model.

        :return: string
        """
        return self.email

    def get_full_name(self):
        """
        Return the first_name plus the last_name, with a space in between.

        :return: string
        """
        return self.name

    def get_short_name(self):
        """
        Return the first_name.

        :return: string
        """
        return self.first_name.split()[0]

    def activation_expired(self):
        """
        Check if user's activation has expired.

        :return: boolean
        """
        return (
            self.date_joined + timedelta(days=settings.ACCOUNT_ACTIVATION_DAYS)
            < timezone.now()
        )
