"""
@file pose_processor.py

@description This script is the main component to the processing of the video, and is what
             applies the mediapipe pose estimation. Here is where we will add most of the 
             functionality of the pose estimation such as rep counting etc.
             
@version 1.0.0
@date 2024-07-31
@author Avery Crane
"""
import cv2
import mediapipe as mp
import numpy as np

# create our mediapipe tools
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

# Rep counting tolerance and key values
tolerance = 30
keyValues = ['Nose', 'Left eye', 'Right eye', 'Left ear', 'Right ear', 'Left shoulder',
             'Right shoulder', 'Left elbow', 'Right elbow', 'Left wrist', 'Right wrist',
             'Left hip', 'Right hip', 'Left knee', 'Right knee', 'Left ankle', 'Right ankle']


"""
    Count reps based on change of joints.

    Param:
        previous_pose: the previous pose landmarks
        current_pose: the current pose landmarks
        previous_state: the previous state of the action
        flag: the flag to change or not

    Returns:
        string: a string in case none found
        current_pose: the current pose landmarks
        current_state: the current state
        flag: the current flag
"""
def count_repetition(previous_pose, current_pose, previous_state, flag):
    if current_pose[10].visibility < 0.5:
        return 'Cannot detect any joint in the frame', previous_pose, previous_state, flag
    else:
        string, current_state = '', previous_state.copy()
        sdy, sdx = 0, 0
        
        # Process key points from left shoulder to right ankle        
        for i in range(5, 17):
            dx = current_pose[i].x - previous_pose[i].x
            dy = current_pose[i].y - previous_pose[i].y
            if dx < tolerance / 1000 and dx > (-1 * tolerance / 1000):
                dx = 0
            if dy < tolerance / 1000 and dy > (-1 * tolerance / 1000):
                dy = 0
            sdx += dx
            sdy += dy
        if sdx > (tolerance * 3 / 1000):
            current_state[0] = 1
        elif sdx < (tolerance * -3 / 1000):
            current_state[0] = 0
        if sdy > (tolerance * 3 / 1000):
            current_state[1] = 1
        elif sdy < (tolerance * -3 / 1000):
            current_state[1] = 0
        if current_state != previous_state:
            flag = (flag + 1) % 2
        return string, current_pose, current_state.copy(), flag

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
    flag = -1
    previous_pose = None
    current_state = [2, 2]

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
            processed_image, confidence, pose_landmarks = process_frame(image, pose, frames_processed, rep_count)
            
            if processed_image is not None:
                total_confidence += confidence
                out.write(processed_image)
                
                if previous_pose is None:
                    previous_pose = pose_landmarks.landmark
                text, previous_pose, current_state, flag = count_repetition(previous_pose, pose_landmarks.landmark, current_state, flag)
                if flag == 1:
                    rep_count += 1
                    flag = -1
                
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
    cv2.putText(image, f"Frame: {frame_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(image, f"Confidence: {confidence:.2f}", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(image, 'Count: ' + str(rep_count), (10, 110), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

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
