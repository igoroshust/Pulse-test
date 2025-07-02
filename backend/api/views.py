from django.shortcuts import render
from django.db import connections
from rest_framework.response import Response
from rest_framework import permissions, viewsets

from dashboard.models import *
from .serializers import *

class InformationViewSet(viewsets.ModelViewSet):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.AllowAny]

class WorkTimeViewSet(viewsets.ModelViewSet):
    queryset = Work_time.objects.all()
    serializer_class = WorkTimeSerializer
    permission_classes = [permissions.AllowAny]

class TalonViewSet(viewsets.ModelViewSet):
    queryset = Talon.objects.all()
    serializer_class = TalonSerializer
    permission_classes = [permissions.AllowAny]

class WindowViewSet(viewsets.ModelViewSet):
    queryset = Window.objects.all()
    serializer_class = WindowSerializer
    permission_classes = [permissions.AllowAny]

class DepartmentViewSet(viewsets.ModelViewSet):
    queryset = Department.objects.all()
    serializer_class =DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class UnitViewSet(viewsets.ModelViewSet):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    permission_classes = [permissions.AllowAny]

class WorkTimeRangeViewSet(viewsets.ModelViewSet):
    queryset = Work_time_range.objects.all()
    serializer_class = WorkTimeRangeSerializer
    permission_classes = [permissions.AllowAny]

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        try:
            # Получаем данные из сторонней базы
            with connections['test'].cursor() as cursor:
                cursor.execute("""SELECT * FROM test""")
                columns = [col[0] for col in cursor.description]
                data = cursor.fetchall()
                # Сохраняем данные в базу default
                Test.objects.all().delete()  # Очистим таблицу перед добавлением новых данных
                for row in data:
                    # Создаём словарь для сохранения
                    data_dict = {columns[i]: row[i] for i in range(len(columns))}
                    # Создаём объект Test и сохраняем его
                    Test.objects.create(**data_dict)

            # Получаем обновленные данные из локальной базы
            updated_queryset = self.get_queryset()
            serializer = self.get_serializer(updated_queryset, many=True)

            # Возвращаем сериализованные данные
            return Response(serializer.data)
        except Exception as e:
            return Response({'error': str(e)}, status=500)

