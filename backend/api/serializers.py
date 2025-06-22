from dashboard.models import Information
from rest_framework import serializers

class InformationSerializer(serializers.HyperlinkedModelSerializer):
    """Модель Информация"""
    class Meta:
        model = Information
        fields = ['org_name', 'deep', 'average', 'active',]