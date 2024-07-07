import cv2
import mediapipe as mp
import tempfile
from django.core.files import File
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import WorkoutVideo
from .serializers import WorkoutVideoSerializer

class WorkoutVideoViewSet(viewsets.ModelViewSet):
    queryset = WorkoutVideo.objects.all()
    serializer_class = WorkoutVideoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        # Analyze the video and generate feedback
        video_path = serializer.instance.video.path
        feedback, processed_video_path = self.analyze_workout_form(video_path)
        print("finish analyze")

        # Save feedback and processed video path to serializer instance
        serializer.instance.feedback = feedback
        with open(processed_video_path, 'rb') as processed_video:
            django_file = File(processed_video)
            serializer.instance.processed_video.save(f"processed_{serializer.instance.video.name}", django_file, save=True)

        serializer.instance.save()

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def analyze_workout_form(self, video_path):
        try:
            print("Start analyze")
            mp_drawing = mp.solutions.drawing_utils
            mp_pose = mp.solutions.pose
            pose = mp_pose.Pose(static_image_mode=False, min_detection_confidence=0.5, min_tracking_confidence=0.5)

            cap = cv2.VideoCapture(video_path)
            
            if not cap.isOpened():
                raise IOError(f"Error opening video file {video_path}")

            # Get video properties
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            fps = int(cap.get(cv2.CAP_PROP_FPS))

            # Create a temporary file for the processed video
            with tempfile.NamedTemporaryFile(suffix='.mp4', delete=False) as temp_file:
                processed_video_path = temp_file.name
                out = cv2.VideoWriter(processed_video_path, cv2.VideoWriter_fourcc(*'mp4v'), fps, (width, height))

            feedback = []

            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break

                # Convert the BGR image to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

                # Process the frame with MediaPipe Pose
                results = pose.process(rgb_frame)

                if results.pose_landmarks:
                    # Draw the pose landmarks on the frame
                    mp_drawing.draw_landmarks(
                        frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                # Write the frame to the output video
                out.write(frame)

            cap.release()
            out.release()
            pose.close()

            return "; ".join(feedback) if feedback else "Good form!", processed_video_path

        except Exception as e:
            print(f"Error analyzing workout form: {str(e)}")
            return "Error analyzing workout form", None
