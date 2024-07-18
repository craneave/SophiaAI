import sys
import json
import os
import cv2
import mediapipe as mp
import numpy as np

def process_video(video_path, output_path):
    try:
        mp_pose = mp.solutions.pose
        mp_drawing = mp.solutions.drawing_utils
        mp_drawing_styles = mp.solutions.drawing_styles

        cap = cv2.VideoCapture(video_path)
        frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = int(cap.get(cv2.CAP_PROP_FPS))

        # Use MJPG codec which is widely available
        fourcc = cv2.VideoWriter_fourcc(*'MJPG')
        out = cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))

        frames_processed = 0
        total_confidence = 0

        with mp_pose.Pose(
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7,
            model_complexity=2
        ) as pose:
            while cap.isOpened():
                success, image = cap.read()
                if not success:
                    break

                image = cv2.resize(image, (frame_width, frame_height))

                image.flags.writeable = False
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = pose.process(image)

                image.flags.writeable = True
                image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

                if results.pose_landmarks:
                    frames_processed += 1
                    landmark_confidence = sum(lm.visibility for lm in results.pose_landmarks.landmark) / len(results.pose_landmarks.landmark)
                    total_confidence += landmark_confidence

                    mp_drawing.draw_landmarks(
                        image,
                        results.pose_landmarks,
                        mp_pose.POSE_CONNECTIONS,
                        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
                    )

                    cv2.putText(image, f"Frame: {frames_processed}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
                    cv2.putText(image, f"Confidence: {landmark_confidence:.2f}", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

                out.write(image)

        cap.release()
        out.release()

        average_confidence = total_confidence / frames_processed if frames_processed > 0 else 0

        return {
            "framesProcessed": frames_processed,
            "averageConfidence": float(average_confidence),
            "processedVideoPath": output_path
        }
    except Exception as e:
        print(f"Error in process_video: {str(e)}", file=sys.stderr)
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python process_video.py <input_video_path>", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    output_dir = "results"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f'Processed-{os.path.basename(video_path)}')
    
    # Change the output file extension to .avi
    output_path = os.path.splitext(output_path)[0] + '.avi'
    
    result = process_video(video_path, output_path)

    with open('results.json', 'w') as f:
        json.dump(result, f, indent=2)

    print("Processing complete")