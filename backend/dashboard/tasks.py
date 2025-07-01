# from celery import shared_task
# from channels.layers import get_channel_layer
# from channels.db import database_sync_to_async
# from .models import Information
# import asyncio
#
# previous_data = []
#
# @shared_task
# async def check_for_updates():
#     global previous_data
#     channel_layer = get_channel_layer()
#
#     current_data = list(Information.objects.all().values())
#
#     if current_data != previous_data:
#         # Отправка обновлений в группу
#         database_sync_to_async(channel_layer.group_send)(
#             "information_updates",
#             {
#                 "type": "information.update",
#                 "data": current_data,
#             }
#         )
#         previous_data = current_data