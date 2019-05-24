from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from jwt_auth.consumers import AuthedConsumer, AnonConsumer
from django.urls import path
from jwt_auth.auth_backend import JWTAuthChannelsMiddleware

def get_asgi_application():
    routes_dict = {
        "websocket": JWTAuthChannelsMiddleware(
            URLRouter([
                path("authed-ws/", AuthedConsumer),
                path("anon-ws/", AnonConsumer),
            ])
        ),
    }

    return ProtocolTypeRouter(routes_dict)
