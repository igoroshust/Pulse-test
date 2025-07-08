from django.core.cache import cache
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.db import connections
import asyncio
import json


class MainPageConsumer(AsyncWebsocketConsumer):
    """Потребитель для главной страницы"""

    async def connect(self):
        """Установка соединения"""
        await self.accept()
        await self.channel_layer.group_add("information_updates", self.channel_name)

        # Отправляем начальные данные
        initial_data = await self.get_data()
        await self.send(text_data=json.dumps({'data': initial_data}))

        # Запускаем задачу для проверки изменений
        self.check_changes_task = asyncio.create_task(self.check_for_changes())

    async def disconnect(self, close_code):
        """Разрыв соединения"""
        await self.channel_layer.group_discard("information_updates", self.channel_name)

        # Отменяем задачу, если она еще выполняется
        if hasattr(self, 'check_changes_task'):
            self.check_changes_task.cancel()

    async def check_for_changes(self):
        """Проверка изменений в базе данных"""
        last_data = await self.get_data()
        while True:
            await asyncio.sleep(10)  # Проверяем каждые 5 секунд
            current_data = await self.get_data()

            # Находим изменившиеся данные
            updated_data = [item for item in current_data if item not in last_data]

            if updated_data:  # Если есть изменения
                await self.send(text_data=json.dumps({'data': updated_data}))
                last_data = current_data  # Обновляем последнее состояние данных

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
                columns = [col[0] for col in cursor.description] # Получаем названия столбцов из результата запроса
                data = cursor.fetchall()

                # Преобразуем данные в список словарей, где ключи - названия столбцов
                result = [dict(zip(columns, row)) for row in data]
                return result

        except Exception as e:
            return {'Error': str(e)}

    async def receive(self, text_data):
        """Обработка полученных текстовых данных через WebSocket"""
        data = json.loads(text_data) # Декодируем входящие текстовые данных из JSON-формата
        print(data)

        # Проверяем, какое действие указано в полученных данных
        if data.get('action') == 'apply':
            # Извлекаем параметры из полученных данных
            filial = data.get('filial')
            date = data.get('date')
            range = data.get('range')

            # Выполняем SQL-запрос с полученными данными
            results = await self.get_about_page_data(filial, date, range)
            # Отправляем полученные данные клиенту обратно в формате JSON
            await self.send(text_data=json.dumps({'data': results}))
        else:
            print('Действие не распознано.')
