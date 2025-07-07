from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db import connections
from rest_framework.response import Response
import asyncio
import json


class MainPageConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Установка соединения"""
        await self.accept()
        print("Соединение установлено! (Main)")
        await self.channel_layer.group_add("information_updates", self.channel_name)

        # Запускаем задачу для периодического получения данных
        self.send_data_task = asyncio.create_task(self.send_data_periodically())

    async def disconnect(self, close_code):
        """Разрыв соединения"""
        await self.channel_layer.group_discard("information_updates", self.channel_name)

        # Отменяем задачу, если она еще выполняется
        if hasattr(self, 'send_data_task'):
            self.send_data_task.cancel()

    async def send_data_periodically(self):
        """Периодическая отправка данных каждые 5 секунд"""
        while True:
            data = await self.get_data()
            await self.send(text_data=json.dumps({'data': data}))
            await asyncio.sleep(10000000)  # Ждем 5 секунд перед следующим запросом

    @database_sync_to_async
    def get_data(self):
        """Получение данных из базы (асинхронно)"""
        try:
            with connections['test'].cursor() as cursor:
                cursor.execute("SELECT * FROM eo")
                columns = [col[0] for col in cursor.description]
                data = cursor.fetchall()

                # Преобразуем данные в список словарей
                result = [dict(zip(columns, row)) for row in data]
                return result

        except Exception as e:
            return {'error': str(e)}


class AboutPageConsumer(AsyncWebsocketConsumer):
    """Потребитель для страницы about-page"""
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add('about_page_updates', self.channel_name)

    async def disconnect(self):
        await self.disconnect()
        await self.channel_layer.group_discard('about_page_updates', self.channel_name)

    @database_sync_to_async
    def get_about_page_data(self, filial, date, range):
        try:
            with connections['test'].cursor() as cursor:
                query = "SELECT * FROM eo WHERE filial = %s AND date = %s AND range = %s"
                cursor.execute(query, [filial, date, range])
                columns = [col[0] for col in cursor.description]
                data = cursor.fetchall()

                # Преобразуем данные в список словарей
                result = [dict(zip(columns, row)) for row in data]
                return result

        except Exception as e:
            return {'Error': str(e)}

    async def receive(self, text_data):
        """Обработка полученных текстовых данных"""
        data = json.loads(text_data)
        print(data)

        if data.get('action') == 'apply':
            filial = data.get('filial')
            date = data.get('date')
            range = data.get('range')

            # Выполняем SQL-запрос с полученными данными
            results = await self.get_about_page_data(filial, date, range)
            await self.send(text_data=json.dumps({'data': results}))
        else:
            print('Действие не распознано.')