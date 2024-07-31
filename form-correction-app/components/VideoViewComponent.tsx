/**
 * @file video_view_component.tsx
 * 
 * @description This component displays a video player with controls for playback and additional 
 *              functionality such as saving to the library, retaking, and uploading. It supports 
 *              both the original and processed video views.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Import necessary modules and components */
import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { saveToLibraryAsync } from "expo-media-library";
import IconButton from "./IconButton";

/* Define the props for the VideoViewComponent */
interface VideoViewProps {
  video: string;                      // URI of the video to be played
  processedVideoUrl?: string | null; // URI of the processed video, if available
  setVideo: React.Dispatch<React.SetStateAction<string | null>>; // Function to update the video state
  onUpload?: () => void;             // Optional function to handle upload action
  onRetake: () => void;              // Function to handle retake action
}

/* Main VideoViewComponent */
export default function VideoViewComponent({ 
  video, 
  processedVideoUrl, 
  setVideo, 
  onUpload, 
  onRetake 
}: VideoViewProps) {
  const ref = useRef<VideoView>(null); // Reference to the VideoView component
  const [isPlaying, setIsPlaying] = useState(true); // State to manage video playback status
  const currentVideoUrl = processedVideoUrl || video; // Determine which video URL to use
  
  /* Initialize the video player with the current video URL */
  const player = useVideoPlayer(currentVideoUrl, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  /* Update playback status on change */
  useEffect(() => {
    const subscription = player.addListener("playingChange", (isPlaying) => {
      setIsPlaying(isPlaying);
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        {/* Button to retake the video */}
        <IconButton
          onPress={onRetake}
          iosName={"camera.rotate"}
          androidName="camera-reverse"
        />
        {/* Button to save video to the library */}
        <IconButton
          onPress={async () => {
            await saveToLibraryAsync(currentVideoUrl);
            Alert.alert("✅ Video saved!");
          }}
          iosName={"arrow.down"}
          androidName="download"
        />
        {/* Button to toggle play/pause */}
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
        {/* Button to upload the video (if available) */}
        {onUpload && !processedVideoUrl && (
          <IconButton
            iosName="checkmark.circle.fill"
            androidName="checkmark-circle"
            onPress={onUpload}
          />
        )}
      </View>
      {/* Video player component */}
      <VideoView
        style={styles.video}
        ref={ref}
        player={player}
        nativeControls={false}
      />
      {/* Indicator for video type (original or processed) */}
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorText}>
          {processedVideoUrl ? "Processed Video" : "Original Video"}
        </Text>
      </View>
    </View>
  );
}

/* Styles for the VideoViewComponent */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    position: "absolute",
    top: 10,
    zIndex: 1,
    gap: 85,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 50,
  },
  video: {
    flex: 1,
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  indicatorText: {
    color: 'white',
    fontSize: 12,
  },
});
