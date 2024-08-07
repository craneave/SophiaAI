"""
@file pose_processor.py

@description This script is the main component to the processing of the video, and is what
             applies the mediapipe pose estimation. Here is where we will add most of the 
             functionality of the pose estimation such as rep counting etc.
             
@version 1.0.0
@date 2024-07-31
@author Avery Crane
"""
from unittest import result
import cv2
import mediapipe as mp
import numpy as np

# create our mediapipe tools
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Rep counting tolerance and key values
tolerance = 5
mediapipe_pose_keypoints = [
    # Face
    "nose",
    "left_eye_inner",  "left_eye",  "left_eye_outer",
    "right_eye_inner", "right_eye", "right_eye_outer",
    "left_ear", "right_ear",
    "mouth_left", "mouth_right",

    # Upper body
    "left_shoulder",  "right_shoulder",
    "left_elbow",     "right_elbow",
    "left_wrist",     "right_wrist",

    # Hands
    "left_pinky",  "right_pinky",
    "left_index",  "right_index",
    "left_thumb",  "right_thumb",

    # Lower body
    "left_hip",    "right_hip",
    "left_knee",   "right_knee",
    "left_ankle",  "right_ankle",

    # Feet
    "left_heel",   "right_heel",
    "left_foot_index", "right_foot_index"
]
KEY_STATES = {
    'start': [0, 0],  # Initial state
    'down': [0, 1],   # Lower position
    'up': [1, 0]      # Upper position
}

"""
    Count reps based on change of joints.

    Param:
        previous_pose: the previous pose landmarks
        current_pose: the current pose landmarks
        previous_state: the previous state of the action
        rep_count: # of reps so far
        flag: the flag to change or not

    Returns:
        string: a string in case none found
        current_pose: the current pose landmarks
        current_state: the current state
        rep_count: # of reps
        flag: the current flag
"""
def count_repetition(previous_pose, current_pose, previous_state, rep_count, flag):
    current_state = previous_state.copy()
    movement_threshold = 0.015  # Adjust as needed
    cooldown = 15  # Frames to wait before counting another rep
    
    # Key points for both exercises
    upper_body_points = [11, 12, 13, 14, 15, 16]  # Shoulders, elbows, wrists
    lower_body_points = [23, 24, 25, 26, 27, 28]  # Hips, knees, ankles
    
    upper_movement = sum(current_pose[i].y - previous_pose[i].y for i in upper_body_points) / len(upper_body_points)
    lower_movement = sum(current_pose[i].y - previous_pose[i].y for i in lower_body_points) / len(lower_body_points)
    
    # Determine the exercise type and state based on movement
    if abs(upper_movement) > abs(lower_movement):
        # Likely a shoulder press
        if upper_movement < -movement_threshold:
            current_state = KEY_STATES['up']
        elif upper_movement > movement_threshold:
            current_state = KEY_STATES['down']
    else:
        # Likely a squat
        if lower_movement < -movement_threshold:
            current_state = KEY_STATES['up']
        elif lower_movement > movement_threshold:
            current_state = KEY_STATES['down']
    
    # Count rep when a full cycle is completed and cooldown has passed
    if current_state != previous_state and flag >= cooldown:
        if (previous_state == KEY_STATES['down'] and current_state == KEY_STATES['up']):
            rep_count += 1
            flag = 0
    else:
        flag += 1
    
    return current_pose, current_state, rep_count, flag
"""
    Process the input video, apply MediaPipe pose estimation, and write processed frames to the output video.

    Param:
        cap (cv2.VideoCapture): VideoCapture object for the input video.
        out (cv2.VideoWriter): VideoWriter object for the output video.

    Returns:
        dict: A dictionary containing the number of frames processed and the average confidence.
"""


def process_video_with_pose(cap, out):
    frames_processed = 0
    total_confidence = 0
    rep_count = 0
    flag = 0
    previous_pose = None
    current_state = KEY_STATES['start']

    with mp_pose.Pose(
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7,
        model_complexity=2
    ) as pose:
        while cap.isOpened():
            success, image = cap.read()

            if not success:
                break

            frames_processed += 1
            processed_image, confidence, pose_landmarks = process_frame(
                image, pose, frames_processed, rep_count)

            if processed_image is not None and pose_landmarks is not None:
                total_confidence += confidence
                out.write(processed_image)

                if previous_pose is None:
                    previous_pose = pose_landmarks.landmark
                else:
                     previous_pose, current_state, rep_count, flag = count_repetition(
            previous_pose, pose_landmarks.landmark, current_state, rep_count, flag)

    average_confidence = total_confidence / frames_processed if frames_processed > 0 else 0

    return {
        "framesProcessed": frames_processed,
        "averageConfidence": float(average_confidence),
        "repCount": rep_count
    }



"""
    Process a single frame to detect pose landmarks and overlay the landmarks and frame information on the image.

    Args:
        image (np.ndarray): The input image frame.
        pose (mp_pose.Pose): The MediaPipe Pose object for detecting pose landmarks.
        frame_count (int): The current frame count.

    Returns:
        tuple: Processed image with landmarks and frame information, and the confidence of pose detection.
"""


def process_frame(image, pose, frame_count, rep_count):
    image.flags.writeable = False
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    if results.pose_landmarks:
        draw_pose_landmarks(image, results)
        confidence = get_landmark_confidence(results)
        add_frame_info(image, confidence, frame_count, rep_count)
        return image, confidence, results.pose_landmarks
    return None, 0, None


"""
    Draw pose landmarks on the image using MediaPipe drawing utilities.
    (kept this a seperate function for future use)
    Args:
        image (np.ndarray): The input image frame.
        results (mp_pose.PoseLandmarks): The pose landmarks detected by MediaPipe.

    Returns:
        None
"""


def draw_pose_landmarks(image, results):
    mp_drawing.draw_landmarks(
        image,
        results.pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
        landmark_drawing_spec=mp_drawing_styles.get_default_pose_landmarks_style()
    )


"""
    Overlay frame information such as frame count and confidence score on the image.
    (temporary, may change, we'll see, kinda fun for now)
    Args:
        image (np.ndarray): The input image frame.
        confidence (float): The confidence score of the pose detection.
        frame_count (int): The current frame count.

    Returns:
        None
"""


def add_frame_info(image, confidence, frame_count, rep_count):
    cv2.putText(image, f"Frame: {frame_count}", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(image, f"Confidence: {confidence:.2f}",
                (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(image, 'Count: ' + str(rep_count), (10, 110),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)


"""
    Calculate the confidence score for the detected pose landmarks.
    (again, not entirely needed but sure)
    Args:
        results (mp_pose.PoseLandmarks): The pose landmarks detected by MediaPipe.

    Returns:
        float: The average confidence score of the pose landmarks.
"""


def get_landmark_confidence(results):
    if results.pose_landmarks:
        return sum(lm.visibility for lm in results.pose_landmarks.landmark) / len(results.pose_landmarks.landmark)
    return 0
