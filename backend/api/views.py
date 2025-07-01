from django.shortcuts import render
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