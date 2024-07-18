import * as React from "react";
import { StyleSheet, View } from "react-native";
import { CameraMode } from "expo-camera";

interface BottomRowToolsProps {
  cameraMode: CameraMode;
  setCameraMode: React.Dispatch<React.SetStateAction<CameraMode>>;
}
export default function BottomRowTools({
  setCameraMode,
}: BottomRowToolsProps) {
  return (
    <View style={[styles.bottomContainer, styles.directionRowItemsCenter]}>
      <View style={styles.directionRowItemsCenter}>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  directionRowItemsCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  bottomContainer: {
    width: "100%",
    justifyContent: "space-between",
    position: "absolute",
    alignSelf: "center",
    bottom: 6,
  },
});