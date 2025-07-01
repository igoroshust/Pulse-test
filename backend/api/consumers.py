from channels.generic.websocket import AsyncWebsocketConsumer # Асинхронный WS-потребитель
from channels.db import database_sync_to_async
import json
import asyncio


class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Установка соединения"""
        # Добавляем текущее соединение в группу "information_updates"
        await self.channel_layer.group_add("information_updates", self.channel_name)
        await self.accept() # Принятие соединения


    async def disconnect(self, close_code):
        """Разрыв соединения"""
        await self.channel_layer.group_discard("information_updates", self.channel_name)

    async def information_update(self, event):
        """Событие обновления информации"""
        data = event['data'] # Извлечение данных из события
        # Отправляем данные клиенту в формате JSON
        await self.send(text_data=json.dumps({'data': data}))

    @database_sync_to_async
    def get_data(self):
        """Получение данных из базы (асинхронно)"""
        from dashboard.models import Information
        data = list(Information.objects.all().values())
        print("Данные из базы:", data)
        return data

    async def receive(self, text_data):
        """Обработка полученных текстовых данных"""
        print("Полученные данные:", text_data)
        data = await self.get_data()
        await self.send(text_data=json.dumps({'data': list(data)}))
