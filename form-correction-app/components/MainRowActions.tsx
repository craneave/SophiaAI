import * as React from "react";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraMode } from "expo-camera";
import { Colors } from "@/constants/Colors";

interface MainRowActionsProps {
  handleRecord: () => void;
  cameraMode: CameraMode;
  isRecording: boolean;
}

export default function MainRowActions({
  cameraMode,
  handleRecord,
  isRecording,
}: MainRowActionsProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleRecord}>
        <SymbolView
          name={
            cameraMode === "video"
              ? "circle"
              : isRecording
              ? "record.circle.fill"
              : "circle.fill"
          }
          size={90}
          type="hierarchical"
          tintColor={isRecording ? Colors.light.snapPrimary : "white"}
          animationSpec={{
            effect: {
              type: isRecording ? "pulse" : "bounce",
            },
            repeating: isRecording,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 100,
    position: "absolute",
    bottom: 45,
  },
});
