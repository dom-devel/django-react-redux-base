from django.conf.urls import url
from django.utils.translation import ugettext_lazy as _
import knox.views as knox_views

import accounts.views

urlpatterns = [
    url(_(r"^register/$"), accounts.views.UserRegisterView.as_view(), name="register"),
    url(_(r"^login/$"), accounts.views.UserLoginView.as_view(), name="login"),
    url(_(r"^logout/$"), knox_views.LogoutView.as_view(), name="logout"),
    url(r"^logoutall/$", knox_views.LogoutAllView.as_view(), name="knox_logoutall"),
    url(
        _(r"^confirm/email/(?P<activation_key>.*)/$"),
        accounts.views.UserConfirmEmailView.as_view(),
        name="confirm_email",
    ),
    url(
        _(r"^status/email/$"),
        accounts.views.UserEmailConfirmationStatusView.as_view(),
        name="status",
    ),
]
