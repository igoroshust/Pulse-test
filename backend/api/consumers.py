# from django.core.cache import cache
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
            await asyncio.sleep(10000000000)  # Проверяем каждые 5 секунд
            current_data = await self.get_data()

            # Находим изменившиеся данные
            updated_data = [item for item in current_data if item not in last_data]

            if updated_data:  # Если есть изменения
                await self.send(text_data=json.dumps({'data': updated_data}))
                last_data = current_data  # Обновляем последнее состояние данных

    @database_sync_to_async
    def get_data(self):
        """Получение данных ДЛЯ ТАБЛИЦЫ из базы (асинхронно)"""
        try:
            with connections['test'].cursor() as cursor:
                # Запрос для получения названий филиалов, количества активных окон и фактических активных окон
                query = """
                SELECT d.name AS filial_name,
                       w.number AS window_number,
                       COUNT(CASE WHEN w.active = 1 AND w.deleted = 0 THEN 1 END) AS active_windows_count,
                       COUNT(CASE WHEN w.active = 1 AND w.paused = 0 AND w.online = 1 AND w.deleted = 0 THEN 1 END) AS fact_active_windows_count,
                       COUNT(CASE WHEN w.active = 1 AND w.paused = 0 AND w.online = 0 AND w.deleted = 0 THEN 1 END) AS inactive_windows,
                       AVG(COALESCE((strftime('%s', 'now', '+9 hours') - strftime('%s', s.start_wait_time)) / 60, 0)) AS difference_in_minutes,
                       s.fio
                FROM window w
                JOIN department d ON w.department_id = d.id
                LEFT JOIN seans s ON s.unit_id = d.unit_id
                WHERE s.serv_day = date('now') AND s.status_id = 1 AND s.start_wait_time IS NOT NULL
                GROUP BY d.name, w.number, s.fio
                HAVING AVG(COALESCE((strftime('%s', 'now', '+9 hours') - strftime('%s', s.start_wait_time)) / 60, 0)) > 0
                ORDER BY d.name;
                """
                cursor.execute(query)
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

    async def disconnect(self, close_code):  # Добавляем аргумент close_code
        await self.channel_layer.group_discard('about_page_updates', self.channel_name)

    async def receive(self, text_data):
        """Обработка полученных текстовых данных через WebSocket"""
        data = json.loads(text_data)  # Декодируем входящие текстовые данных из JSON-формата
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


    @database_sync_to_async
    def get_about_page_data(self, filial, date, range):
        try:
            with connections['test'].cursor() as cursor:
                query = "SELECT * FROM eo WHERE filial = %s AND date = %s AND range = %s"
                cursor.execute(query, [filial, date, range])
                columns = [col[0] for col in cursor.description]  # Получаем названия столбцов из результата запроса
                data = cursor.fetchall()

                # Преобразуем данные в список словарей, где ключи - названия столбцов
                result = [dict(zip(columns, row)) for row in data]
                return result

        except Exception as e:
            return {'Error': str(e)}




# CREATE TABLE talon (
#     id INTEGER PRIMARY KEY,
#     serv_day DATE,
#     status_id INTEGER,
#     unit_id INTEGER,
#     talon_type_id INTEGER,
#     service_id INTEGER,
#     count_service INTEGER,
#     prefix VARCHAR(500),
#     number INTEGER,
#     full_number INTEGER,
#     pin BIGINT,
#     priority INTEGER,
#     reserve_time TIMESTAMP,
#     fio VARCHAR(500),
#     snils VARCHAR(500),
#     arrival_time TIMESTAMP,
#     cancellation_time TIMESTAMP,
#     book_id INTEGER,
#     mobile_phone BIGINT,
#     snils_check_id INTEGER,
#     source VARCHAR(1000),
#     activation_source VARCHAR(500),
#     life_situation_id INTEGER,
#     live_situation_time_service TIMESTAMP,
#     card_data VARCHAR(500),
#     book_from VARCHAR(500),
#     email VARCHAR(500),
#     notes VARCHAR(500),
#     source_type VARCHAR(500),
#     vk_notified INTEGER
# );


# CREATE TABLE work_time (
#     id INTEGER PRIMARY KEY,
#     unit_id INTEGER,
#     description VARCHAR(500),
#     mon INTEGER DEFAULT 0,
#     tue INTEGER DEFAULT 0,
#     thu INTEGER DEFAULT 0,
#     fri INTEGER DEFAULT 0,
#     sat INTEGER DEFAULT 0,
#     sun INTEGER DEFAULT 0,
#     temp INTEGER DEFAULT 0,
#     mon_prerecord_factor INTEGER,
#     tue_prerecord_factor INTEGER,
#     thu_prerecord_factor INTEGER,
#     fri_prerecord_factor INTEGER,
#     sat_prerecord_factor INTEGER,
#     sun_prerecord_factor INTEGER,
#     prf INTEGER DEFAULT 0,
#     prf_work_time_id INTEGER,
#     type INTEGER DEFAULT 0
# );


# CREATE TABLE work_time_range (
#     id INTEGER PRIMARY KEY,
#     time_from TIME,
#     time_to TIME,
#     date DATE,
#     description VARCHAR(500),
#     holiday INTEGER,
#     mon INTEGER,
#     tue INTEGER,
#     wed INTEGER,
#     thu INTEGER,
#     fri INTEGER,
#     sat INTEGER,
#     sun INTEGER,
#     day INTEGER,
#     month INTGER,
#     year INTEGER,
#     unit_id INTEGER,
#     comment VARCHAR(500),
#     prerecord_factor VARCHAR(500),
#     time_service_prerecord VARCHAR(500),
#     prerecord_amount_limit VARCHAR(500),
#     prerecord_window_limit VARCHAR(500)
# );