"""Django settings for djangoreactredux project."""

# We think this is how we run the server with different settings.
# It looks like the __init__ py does a lot of the heavy lifting
# python manage.py runserver --settings=mysite.settings.development

import os

try:
    import djangoreactredux.production_settings as environ_settings
except Exception as e:
    pass

try:
    import djangoreactredux.development_remote_settings as environ_settings
except Exception as e:
    pass

try:
    import djangoreactredux.development_local_settings as environ_settings
except Exception as e:
    pass

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = environ_settings.SECRET_KEY

# Databases
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": environ_settings.POSTGRES_DB,
        "USER": environ_settings.POSTGRES_USER,
        "PASSWORD": environ_settings.POSTGRES_PASSWORD,
        "HOST": "localhost",
        "PORT": "",
    }
}

# Base dir is actually in src.
BASE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "src"
)
# remove /sswmain/settings to get base folder


DEBUG = True

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "django.contrib.messages",
    "django.contrib.sessions",
    "django.contrib.admin",
    "rest_framework",
    "knox",
    "sslserver",
    # 'django_extensions',
    "accounts",
    "base",
]

MIDDLEWARE_CLASSES = [
    "django.middleware.security.SecurityMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.common.CommonMiddleware",
]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ]
        },
    }
]

ROOT_URLCONF = "djangoreactredux.urls"

WSGI_APPLICATION = "djangoreactredux.wsgi.application"

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

AUTH_USER_MODEL = "accounts.User"

ACCOUNT_ACTIVATION_DAYS = 7  # days

STATIC_URL = os.path.join("src", "/static/")
STATIC_ROOT = os.path.join(BASE_DIR, "static_root")
STATICFILES_DIRS = [os.path.join(BASE_DIR, "static_dist")]

# ############# REST FRAMEWORK ###################

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": [],
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "knox.auth.TokenAuthentication",
        # "rest_framework.authentication.SessionAuthentication",
        # "rest_framework.authentication.BasicAuthentication",
    ],
    # 'DEFAULT_AUTHENTICATION_CLASSES': ('knox.auth.TokenAuthentication',),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.FormParser",
        "rest_framework.parsers.MultiPartParser",
    ],
}

# ############ REST KNOX ########################
REST_KNOX = {
    "SECURE_HASH_ALGORITHM": "cryptography.hazmat.primitives.hashes.SHA512",
    "AUTH_TOKEN_CHARACTER_LENGTH": 64,
    "USER_SERIALIZER": "accounts.serializers.UserSerializer",
}


DEBUG = True

PAGE_CACHE_SECONDS = 1

REST_FRAMEWORK[
    "EXCEPTION_HANDLER"
] = (
    "django_rest_logger.handlers.rest_exception_handler"
)  # NOQA (ignore all errors on this line)

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
    "root": {"level": "DEBUG", "handlers": ["django_rest_logger_handler"]},
    "formatters": {
        "verbose": {
            "format": "%(levelname)s %(asctime)s %(module)s "
            "%(process)d %(thread)d %(message)s"
        }
    },
    "handlers": {
        "django_rest_logger_handler": {
            "level": "DEBUG",
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        }
    },
    "loggers": {
        "django.db.backends": {
            "level": "ERROR",
            "handlers": ["django_rest_logger_handler"],
            "propagate": False,
        },
        "django_rest_logger": {
            "level": "DEBUG",
            "handlers": ["django_rest_logger_handler"],
            "propagate": False,
        },
    },
}

DEFAULT_LOGGER = "django_rest_logger"

LOGGER_EXCEPTION = DEFAULT_LOGGER
LOGGER_ERROR = DEFAULT_LOGGER
LOGGER_WARNING = DEFAULT_LOGGER
