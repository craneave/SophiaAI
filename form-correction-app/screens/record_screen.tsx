/**
 * @file record_screen.tsx
 * 
 * @description This is the record screen page that will be shown when the user goes to record a video to upload
 *              This script will handle the camera and will use other scripts for tools and toolbars
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Many Imports */
import * as React from "react";
import { SafeAreaView, StyleSheet, View, Alert } from "react-native";
import { Camera, CameraMode, CameraView, FlashMode } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';
import BottomRowTools from "../components/Tools/BottomRowTools";
import MainRowActions from "../components/MainRowActions";
import CameraTools from "../components/Tools/CameraTools";
import VideoViewComponent from "../components/VideoViewComponent";
import LoadingScreen from "../components/Views/LoadingView";
import { uploadVideo } from "../src/UploadVideo";

/*
 * The main record screen function
 */
export default function RecordScreen() {
  /* Define constants */
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("video");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">("front");
  const [video, setVideo] = React.useState<string | null>(null);
  const [isRecording, setIsRecording] = React.useState<boolean>(false);
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [processedVideoUrl, setProcessedVideoUrl] = React.useState<string | null>(null);
  const [hasPermission, setHasPermission] = React.useState<boolean | null>(null);

  /* Obtain the needed permissions */
  React.useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      const { status: libraryStatus } = await MediaLibrary.requestPermissionsAsync();

      setHasPermission(
        cameraStatus === 'granted' &&
        audioStatus === 'granted' &&
        libraryStatus === 'granted'
      );
    })();
  }, []);

  /* Our toggleRecord function to toggle when to start recording */
  async function toggleRecord() {
    if (isRecording) {
      cameraRef.current?.stopRecording();
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const response = await cameraRef.current?.recordAsync();
      setVideo(response!.uri);
    }
  }

  /* Handle upload which will handle the upload process of the video */
  const handleUpload = async () => {
    if (!video) return;
    setIsUploading(true);
    try {
      const result = await uploadVideo(video);
      setProcessedVideoUrl(result.processedVideoUrl);
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert('Upload Failed', 'There was an error uploading your video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  /* Handle the retake of the video, just resets to previous state */
  const handleRetake = () => {
    setVideo(null);
    setProcessedVideoUrl(null);
  };

  /* If no permision selected, then loading screem (come back to this) */
  if (hasPermission === null) {
    return <LoadingScreen />;
  }

  /* If no permission, do something (come back to this) */
  if (hasPermission === false) {
    return (
      <View style={styles.center}>
      </View>
    );
  }

  /* If we are uploading, show the loading screen */
  if (isUploading) {
    return <LoadingScreen />;
  }

  /* If we got a video back, show it */
  if (processedVideoUrl) {
    return (
      <VideoViewComponent
        video={processedVideoUrl}
        setVideo={setProcessedVideoUrl}
        onRetake={handleRetake}
      />
    );
  }

  /* Show preview of recording */
  if (video) {
    return (
      <VideoViewComponent
        video={video}
        setVideo={setVideo}
        onUpload={handleUpload}
        onRetake={handleRetake}
      />
    );
  }

  /* on return, show the record screen */
  return (
    <CameraView
      ref={cameraRef}
      style={{ flex: 1, width: "100%", height: "100%" }}
      facing={cameraFacing}
      mode={cameraMode}
      enableTorch={cameraTorch}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.fullScreen}>
          <CameraTools
            cameraTorch={cameraTorch}
            setCameraFacing={setCameraFacing}
            setCameraTorch={setCameraTorch}
          />
          <MainRowActions
            isRecording={isRecording}
            handleRecord={toggleRecord}
            cameraMode={cameraMode}
          />
          <BottomRowTools
            cameraMode={cameraMode}
            setCameraMode={setCameraMode}
          />
        </View>
      </SafeAreaView>
    </CameraView>
  );
}

/* Styles, probably changning */
const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});