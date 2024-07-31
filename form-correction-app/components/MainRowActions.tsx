/**
 * @file main_row_actions.tsx
 * 
 * @description This component provides the main action buttons for the camera interface, including 
 *              a recording button that updates its appearance based on the recording status and mode.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Import necessary modules and components */
import * as React from "react";
import { SymbolView } from "expo-symbols";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CameraMode } from "expo-camera";
import { Colors } from "@/constants/Colors";

/* Define the props for the MainRowActions component */
interface MainRowActionsProps {
  handleRecord: () => void; // Function to handle the recording action
  cameraMode: CameraMode;   // Current camera mode (e.g., video or photo)
  isRecording: boolean;     // Indicates if recording is currently active
}

/* MainRowActions component */
export default function MainRowActions({
  cameraMode,
  handleRecord,
  isRecording,
}: MainRowActionsProps) {
  return (
    <View style={styles.container}>
      {/* Button to start/stop recording */}
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

/* Styles for the MainRowActions component */
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
