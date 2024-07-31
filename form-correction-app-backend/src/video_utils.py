"""
@file video_utils.py

@description This script provides utility functions for opening video files and creating video writers 
             using OpenCV. These utilities are used to facilitate the reading and writing of video files 
             for further processing, such as pose estimation.

@version 1.0.0
@date 2024-07-31
@authors Avery Crane
"""
import cv2

"""
    Open a video file for reading using OpenCV.

    Args:
        video_path (str): The path to the video file to be opened.

    Returns:
        cv2.VideoCapture: A VideoCapture object for reading the video file.
"""
def open_video(video_path):
    return cv2.VideoCapture(video_path)

"""
    Create a VideoWriter object for writing video frames to a file using OpenCV.

    Args:
        cap (cv2.VideoCapture): The VideoCapture object used to read the input video, from which the frame width,
                                height, and frames per second (fps) are obtained.
        output_path (str): The path to the output video file.

    Returns:
        cv2.VideoWriter: A VideoWriter object for writing the processed video frames to the specified file.
"""
def create_video_writer(cap, output_path):
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    fourcc = cv2.VideoWriter_fourcc(*'MJPG')
    return cv2.VideoWriter(output_path, fourcc, fps, (frame_width, frame_height))