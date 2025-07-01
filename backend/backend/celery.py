# import os
# from celery import Celery
# from celery.schedules import crontab
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
#
# app = Celery('backend')
# app.config_from_object('django.conf:settings', namespace='CELERY')
# app.autodiscover_tasks()
#
# app.conf.beat_schedule = {
#     'check-for-updates-every-5-seconds': {
#         'task': 'dashboard.tasks.check_for_updates',
#         'schedule': 5.0, # Каждые 5 секунд
#     }
# }