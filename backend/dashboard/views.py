from django.shortcuts import render
from django.db import connections
from django.http import JsonResponse

from dashboard.models import Test

def get_test_data(request):
    try:
        with connections['test'].cursor() as cursor:
            cursor.execute("""SELECT * FROM test""")
            columns = [col[0] for col in cursor.description]
            data = cursor.fetchall()

            # Сохраняем данные в базу default
            for row in data:
                # Создаём словарь для сохранения
                data_dict = {columns[i]: row[i] for i in range(len(columns))}
                # Создаём объект TestData  сохраняем его
                Test.objects.create(**data_dict)

            return JsonResponse({'data': data}, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)