from django.urls import path
from websocket import consumers

websocket_urlpatterns = [
    path('ws/information_updates/', consumers.MainPageConsumer.as_asgi()),
    path('ws/about_page_updates/', consumers.AboutPageConsumer.as_asgi()),
]
