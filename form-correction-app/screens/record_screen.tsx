import * as React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { CameraMode, CameraView, FlashMode } from "expo-camera";
import BottomRowTools from "../components/BottomRowTools";
import MainRowActions from "../components/MainRowActions";
import CameraTools from "../components/CameraTools";
import VideoViewComponent from "../components/VideoUploadView";

export default function HomeScreen() {
  const cameraRef = React.useRef<CameraView>(null);
  const [cameraMode, setCameraMode] = React.useState<CameraMode>("video");
  const [cameraTorch, setCameraTorch] = React.useState<boolean>(false);
  const [cameraFacing, setCameraFacing] = React.useState<"front" | "back">(
    "back"
  );
  const [video, setVideo] = React.useState<string>("");
  const [isRecording, setIsRecording] = React.useState<boolean>(false);

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

  if (video) return <VideoViewComponent video={video} setVideo={setVideo} />;

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

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});