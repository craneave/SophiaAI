/**
 * @file UploadVideo.ts
 * 
 * @description This is the Upload Video script that will upload a video to the backend Express.js using axios
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import axios, { AxiosResponse } from 'axios';

/*
 * Interface to define the structure of the response from the upload endpoint.
 */
interface UploadResponse {
  message: string;
  result: {
    framesProcessed: number;
    averageConfidence: number;
    processedVideoPath: string;
    processedVideoUrl: string;
  };
}

/**
 * Uploads a video to the server for processing and returns the processing results.
 *
 * @param {string} videoUri - The URI of the video file to be uploaded.
 * @returns {Promise<UploadResponse['result']>} - A promise that resolves to the result object containing
 *                                                frames processed, average confidence, processed video path,
 *                                                and processed video URL.
 * @throws Will throw an error if the upload fails.
 */
export const uploadVideo = async (videoUri: string): Promise<UploadResponse['result']> => {
  /* Create a FormData object and append the video file */
  const formData = new FormData();
  formData.append('video', {
    uri: videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  } as any);

  try {
    /* Send a POST request to the server with the video file */
    const response: AxiosResponse<UploadResponse> = await axios.post(
      'http://192.168.1.67:3000/process-video',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    /* Extract the result data from the response */
    const { framesProcessed, averageConfidence, processedVideoPath, processedVideoUrl } = response.data.result;

    /* log results */
    console.log('Frames Processed:', framesProcessed);
    console.log('Average Confidence:', averageConfidence);
    console.log('Processed Video Path:', processedVideoPath);
    console.log('Processed Video URL:', processedVideoUrl);
    return response.data.result;

  } catch (error) {
    console.error('Upload failed', error);
    throw error;
  }
};
