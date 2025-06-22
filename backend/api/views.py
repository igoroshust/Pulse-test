from django.shortcuts import render
from rest_framework import viewsets
from rest_framework import permissions

from dashboard.models import Information
from .serializers import InformationSerializer

class InformationViewSet(viewsets.ModelViewSet):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.AllowAny]
