from rest_framework.authentication import BasicAuthentication


class NoLoopBasicAuthentication(BasicAuthentication):
    def authenticate_header(self, request):
        return ""
