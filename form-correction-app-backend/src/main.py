"""
@file main.py

@description This script processes a video file using mediapipe pose estimation. It reads the input video,
             processes each frame to detect poses, and writes the processed frames to an output video file.
             The results are saved in a JSON file. The script utilizes helper functions from video_utils 
             and pose_processor modules for video handling and pose processing.
             
@version 1.0.0
@date 2024-07-31
@author Avery Crane
"""

import sys
import json
import os
from video_utils import open_video, create_video_writer
from pose_processor import process_video_with_pose

"""
    The main function to process the input video.
    
    Param: 
        video_path (str) the path of the input video 
    Returns:
        None
"""
def main(video_path):
    
    # create the output path
    output_dir = "results"
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f'Processed-{os.path.basename(video_path)}')
    output_path = os.path.splitext(output_path)[0] + '.avi'
    
    # call open_video and create_video_writer to open the video and create the writer
    cap = open_video(video_path)
    out = create_video_writer(cap, output_path)
    
    # obtain the result
    result = process_video_with_pose(cap, out)
    
    # release our resources
    cap.release()
    out.release()
    
    # add to the result list
    result['processedVideoPath'] = output_path
    
    # write to JSON
    with open('results.json', 'w') as f:
        json.dump(result, f, indent=2)
    
    #log completion
    print("Processing complete")

if __name__ == "__main__":
    # checks for required args
    if len(sys.argv) < 2:
        print("Usage: python main.py <input_video_path>", file=sys.stderr)
        sys.exit(1)
    
    # takes path and runs script
    video_path = sys.argv[1]
    main(video_path)