# In app/serializers.py
from rest_framework import serializers
from .models import WorkoutVideo

class WorkoutVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkoutVideo
        fields = ['id', 'video', 'processed_video', 'uploaded_at', 'feedback']
        read_only_fields = ['uploaded_at', 'feedback', 'processed_video']