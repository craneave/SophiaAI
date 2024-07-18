import React, { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, View, Text } from "react-native";
import { useVideoPlayer, VideoView } from "expo-video";
import { saveToLibraryAsync } from "expo-media-library";
import IconButton from "./IconButton";

interface VideoViewProps {
  video: string;
  processedVideoUrl?: string | null;
  setVideo: React.Dispatch<React.SetStateAction<string | null>>; 
  onUpload?: () => void;
  onRetake: () => void;
}

export default function VideoViewComponent({ 
  video, 
  processedVideoUrl, 
  setVideo, 
  onUpload, 
  onRetake 
}: VideoViewProps) {
  const ref = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const currentVideoUrl = processedVideoUrl || video;
  
  const player = useVideoPlayer(currentVideoUrl, (player) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <IconButton
          onPress={onRetake}
          iosName={"camera.rotate"}
          androidName="camera-reverse"
        />
        <IconButton
          onPress={async () => {
            saveToLibraryAsync(currentVideoUrl);
            Alert.alert("✅ Video saved!");
          }}
          iosName={"arrow.down"}
          androidName="download"
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
        {onUpload && !processedVideoUrl && (
          <IconButton
            iosName="checkmark.circle.fill"
            androidName="checkmark-circle"
            onPress={onUpload}
          />
        )}
      </View>
      <VideoView
        style={styles.video}
        ref={ref}
        player={player}
        nativeControls={false}
      />
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorText}>
          {processedVideoUrl ? "Processed Video" : "Original Video"}
        </Text>
      </View>
    </View>
  );
}

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