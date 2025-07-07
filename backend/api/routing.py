from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/information_updates/', consumers.TestConsumer.as_asgi()),
]
