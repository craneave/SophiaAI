from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkoutVideoViewSet

router = DefaultRouter()
router.register(r'workout-videos', WorkoutVideoViewSet)

urlpatterns = [
    path('', include(router.urls)),
]