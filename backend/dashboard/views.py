from django.shortcuts import render

from django.db import connection
from django.http import JsonResponse

def get_test_data(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT * FROM test
            """)

            columns = [col[0] for col in cursor.description]
            data = [dict(zip(columns, row)) for row in cursor.fetchall()]

            return JsonResponse({'data': data}, safe=False)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)