from django.db.models.signals import post_save
from django.dispatch import receiver # Декоратор для обработки сигналов
from channels.layers import get_channel_layer # Получаем слои каналов
from channels.db import database_sync_to_async # Асинхронный доступ к БД
from .models import Information
import asyncio

@receiver(post_save, sender=Information) # Связываем функцию с сигналом для Information
def send_information_update(sender, instance, created, **kwargs):
    """При срабатывании сигнала post_save запускаем асинхронную функцию send_update"""
    asyncio.run(send_update(instance))

async def send_update(instance):
    """Отправка обновлений информации"""
    channel_layer = get_channel_layer() # Получаем слой каналов для отправки сообщений
    data = {
        'id': instance.id,
        'org_name': instance.org_name,
        'average': instance.average,
        'deep': instance.deep,
        'active': instance.active,
    }

    # Отправляем сообщение в группу "information_updates" с типом "information.update"
    await channel_layer.group_send(
        "information_updates",
        {
            "type": "information.update", # Тип сообщения
            "data": [data], # Отправляемые данные
        }
    )