from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from dashboard.views import get_test_data
from api import views

router = routers.DefaultRouter()
router.register(r'information', views.InformationViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('test/', get_test_data, name='get_test_data'),
]
