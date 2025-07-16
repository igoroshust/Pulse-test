import os
from django.core.asgi import get_asgi_application # Получение ASGI-приложения Django
from channels.routing import ProtocolTypeRouter, URLRouter # Классы для маршрутизации протоколов
from channels.auth import AuthMiddlewareStack # Стек промежуточного ПО для аутентификации
from websocket import routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings') # Переменная окружения для настроек Django

application = ProtocolTypeRouter({
    "http": get_asgi_application(), # Обрабатываем HTTP-запросы с помощью ASGI-приложения Django
    "websocket": AuthMiddlewareStack( # Обрабатываем WebSocket-запросы с аутентификацией
        URLRouter( # Используем URLRouter для маршрутизации WS-запросов
            routing.websocket_urlpatterns # Указываем маршрут из приложения dashboard
        )
    ),
})
