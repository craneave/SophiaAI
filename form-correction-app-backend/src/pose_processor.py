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
    
    # Initialize MediaPipe pose with specified confidence thresholds and model complexity. We can change this based on speed, accuracy etc.
    # For now, just hard coded without speed in mind
    with mp_pose.Pose(
        min_detection_confidence=0.7,
        min_tracking_confidence=0.7,
        model_complexity=2
    ) as pose:
        while cap.isOpened():
            success, image = cap.read()
            
            # check if read successfully
            if not success:
                break
            
            # count frames processed and process each frame
            frames_processed += 1
            processed_image, confidence = process_frame(image, pose, frames_processed)
            
            if processed_image is not None:
                total_confidence += confidence
                out.write(processed_image)
    
    # calculate average confidence
    average_confidence = total_confidence / frames_processed if frames_processed > 0 else 0
    
    # return the frames processed and the confidence
    return {
        "framesProcessed": frames_processed,
        "averageConfidence": float(average_confidence),
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
def process_frame(image, pose, frame_count):
    # Convert the image to RGB format for pose processing
    image.flags.writeable = False
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = pose.process(image)
    
    # Convert the image back to BGR format for OpenCV processing
    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)
    
    # Draw the landmarks and obtain the confidence from each
    if results.pose_landmarks:
        draw_pose_landmarks(image, results)
        confidence = get_landmark_confidence(results)
        add_frame_info(image, confidence, frame_count)
        return image, confidence
    return None, 0

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
def add_frame_info(image, confidence, frame_count):
    cv2.putText(image, f"Frame: {frame_count}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
    cv2.putText(image, f"Confidence: {confidence:.2f}", (10, 70), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

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
