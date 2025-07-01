from dashboard.models import *
from rest_framework import serializers

class InformationSerializer(serializers.HyperlinkedModelSerializer):
    """Модель Информация"""

    class Meta:
        model = Information
        fields = ['org_name', 'deep', 'average', 'active',]

class WorkTimeSerializer(serializers.HyperlinkedModelSerializer):
    """Модель Рабочее время"""

    class Meta:
        model = Work_time
        fields = '__all__'

class WindowSerializer(serializers.HyperlinkedModelSerializer):
    """Модель окна"""

    class Meta:
        model = Window
        fields = '__all__'

class TalonSerializer(serializers.HyperlinkedModelSerializer):
    """Модель талоны"""

    class Meta:
        model = Talon
        fields = '__all__'

class DepartmentSerializer(serializers.HyperlinkedModelSerializer):
    """Модель залы"""

    class Meta:
        model = Department
        fields = '__all__'

class UnitSerializer(serializers.HyperlinkedModelSerializer):
    """Модель офисы"""

    class Meta:
        model = Unit
        fields = '__all__'

class WorkTimeRangeSerializer(serializers.HyperlinkedModelSerializer):
    """Модель интервалы"""

    class Meta:
        model = Work_time_range
        fields = '__all__'