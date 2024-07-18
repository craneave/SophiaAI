import axios, { AxiosResponse } from 'axios';

interface UploadResponse {
  message: string;
  result: {
    framesProcessed: number;
    averageConfidence: number;
    processedVideoPath: string;
    processedVideoUrl: string;
  };
}

export const uploadVideo = async (videoUri: string): Promise<UploadResponse['result']> => {
  const formData = new FormData();
  formData.append('video', {
    uri: videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  } as any);

  try {
    const response: AxiosResponse<UploadResponse> = await axios.post(
      'http://192.168.1.67:3000/process-video',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    const { framesProcessed, averageConfidence, processedVideoPath, processedVideoUrl } = response.data.result;

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
