from channels.generic.websocket import AsyncWebsocketConsumer
# from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
import json


class TestConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()

    async def disconnect(self, close_code):
        pass

    # async def receive(self, text_data):
    #     text_data_json = json.loads(text_data)
    #     message = text_data_json['message']
    #     await self.send(text_data=json.dumps({'message': message}))

    @database_sync_to_async
    def get_data(self):
        from dashboard.models import Information
        data = list(Information.objects.all().values())
        print("Данные из базы:", data)
        return data

    async def receive(self, text_data):
        print("Полученные данные:", text_data)
        data = await self.get_data()
        await self.send(text_data=json.dumps({'data': list(data)}))

