import { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";
import { Alert, SafeAreaView, StyleSheet, View } from "react-native";
import IconButton from "./IconButton";
import { shareAsync } from "expo-sharing";
import { saveToLibraryAsync } from "expo-media-library";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

interface VideoViewProps {
  video: string;
  setVideo: React.Dispatch<React.SetStateAction<string>>;
}

export default function VideoViewComponent({
  video,
  setVideo,
}: VideoViewProps) {
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

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        layout={LinearTransition}
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.container}
      >
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
            iosName={"checkmark.circle.fill"}
            androidName={"checkmark-circle"}
            onPress={() => {
              // Send to backend
            }}
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
