from django.conf import settings
from django.conf.urls import include, url
from django.views.decorators.cache import cache_page
from django.conf import settings

# Import local
from base import views as base_views


# If on dev then load up API documentation
if settings.ENVIRONMENT == "dev":
    from rest_framework_swagger.views import get_swagger_view

    schema_view = get_swagger_view(title="Boilerplate API")

    # Swagger URLs
    urlpatterns_addition = [url(r"^api/swagger$", schema_view)]


urlpatterns = [
    url(r"^api/v1/accounts/", include("accounts.urls", namespace="accounts")),
    url(r"^api/v1/auth/", include("djoser.urls")),
    url(r"^api/v1/auth/", include("djoser.urls.authtoken")),
    url(r"^api/v1/getdata/", include("base.urls", namespace="base")),
    # url(r"logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    # catch all others because of how history is handled by react router - cache this page because it will never change
]
urlpatterns.extend(urlpatterns_addition)

# This will catch everything else, so it must run last:
urlpatterns.extend(
    [
        url(
            r"",
            cache_page(settings.PAGE_CACHE_SECONDS)(base_views.IndexView.as_view()),
            name="index",
        )
    ]
)
