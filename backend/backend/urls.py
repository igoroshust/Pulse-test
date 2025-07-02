from django.contrib import admin
from django.urls import path, include

from rest_framework import routers
from dashboard.views import get_test_data
from api import views

router = routers.DefaultRouter()
router.register(r'information', views.InformationViewSet)
router.register(r'work_time', views.WorkTimeViewSet)
router.register(r'window', views.WindowViewSet)
router.register(r'talon', views.TalonViewSet)
router.register(r'department', views.DepartmentViewSet)
router.register(r'unit', views.UnitViewSet)
router.register(r'work_time_range', views.WorkTimeRangeViewSet)
router.register(r'test', views.TestViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # path('test/', get_test_data, name='get_test_data'),
]
