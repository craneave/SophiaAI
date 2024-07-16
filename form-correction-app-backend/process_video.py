import sys
import json
import os
import cv2
import mediapipe as mp

def process_video(video_path, output_path):
    try:
        mp_pose = mp.solutions.pose
        mp_drawing = mp.solutions.drawing_utils
        cap = cv2.VideoCapture(video_path)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(output_path, fourcc, 20.0, (int(cap.get(3)), int(cap.get(4))))

        frames_processed = 0
        total_confidence = 0

        with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
            while cap.isOpened():
                success, image = cap.read()
                if not success:
                    break

                image.flags.writeable = False
                image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
                results = pose.process(image)

                if results.pose_landmarks:
                    frames_processed += 1
                    total_confidence += results.pose_landmarks.landmark[0].visibility
                    image.flags.writeable = True
                    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
                    mp_drawing.draw_landmarks(
                        image, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

                out.write(image)

        cap.release()
        out.release()

        average_confidence = total_confidence / frames_processed if frames_processed > 0 else 0

        return {
            "framesProcessed": frames_processed,
            "averageConfidence": average_confidence,
            "outputVideoPath": output_path
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
    result = process_video(video_path, output_path)

    with open('results.json', 'w') as f:
        json.dump(result, f)

    print("Processing complete")
