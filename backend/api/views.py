from django.shortcuts import render
from rest_framework import permissions, viewsets

from dashboard.models import Information
from .serializers import InformationSerializer

class InformationViewSet(viewsets.ModelViewSet):
    queryset = Information.objects.all()
    serializer_class = InformationSerializer
    permission_classes = [permissions.AllowAny]
