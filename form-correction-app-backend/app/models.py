# In app/models.py
from django.db import models

class WorkoutVideo(models.Model):
    video = models.FileField(upload_to='workout_videos/')
    processed_video = models.FileField(upload_to='processed_videos/', null=True, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    feedback = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Workout video uploaded at {self.uploaded_at}"