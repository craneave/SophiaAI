import React, { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import { saveToLibraryAsync } from "expo-media-library";
import axios, { AxiosResponse } from 'axios';
import Animated, { FadeIn, FadeOut, LinearTransition, } from "react-native-reanimated";
import LoadingScreen from "./LoadingView";

interface VideoViewProps {
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
}

interface UploadResponse {
  message: string;
  result: {
    framesProcessed: number;
    averageConfidence: number;
    processedVideoUrl: string;
  };
}


export default function VideoViewComponent({
  video,
  setVideo,
}: VideoViewProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState<boolean>(false);
  const ref = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const player = useVideoPlayer(video, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);


  const uploadVideo = async () => {
    console.log('Upload vid called...');
    setIsUploading(true);
    setShowLoadingScreen(true);

    const formData = new FormData();
    formData.append('video', {
      uri: video,
      type: 'video/mp4',
      name: 'video.mp4',
    } as any);

    console.log('Starting video upload...');
    try {
      console.log('Sending request to:', 'http://192.168.1.67:3000/process-video');
      const response: AxiosResponse<UploadResponse> = await axios.post(
        'http://192.168.1.67:3000/process-video',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {

          },
        }
      );
      console.log('Upload successful', response.data);
    } catch (error) {
      console.error('Upload failed', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', error.toJSON());
        Alert.alert('Error', 'Failed to upload video: ${error.message}');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsUploading(false);
      setShowLoadingScreen(false); // Hide loading screen
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        layout={LinearTransition}
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.container}
      >
        {!showLoadingScreen ? (
          <>
            <View style={styles.controlsContainer}>
              <IconButton
                onPress={() => setVideo("")}
                iosName={"xmark"}
                androidName="close"
              />
              <IconButton
                onPress={async () => {
                  saveToLibraryAsync(video);
                  Alert.alert("✅ Video saved!");
                }}
                iosName={"arrow.down"}
                androidName="close"
              />
              <IconButton
                iosName={isPlaying ? "pause" : "play"}
                androidName={isPlaying ? "pause" : "play"}
                onPress={() => {
                  if (isPlaying) {
                    player.pause();
                  } else {
                    player.play();
                  }
                  setIsPlaying(!isPlaying);
                }}
              />
              <IconButton
                iosName="checkmark.circle.fill"
                androidName="checkmark-circle"
                onPress={uploadVideo}
              />
            </View>
            <View style={styles.videoContainer}>
              <VideoView
                style={styles.video}
                ref={ref}
                player={player}
                nativeControls={false}
              />
            </View>
          </>
        ) : (
          <LoadingScreen />
        )}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    top: 10,
    right: 6,
    zIndex: 1,
    gap: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  videoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    height: "100%",
  },
});

