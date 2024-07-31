/**
 * @file CameraTools.tsx
 * 
 * @description This component provides tools for controlling the camera, such as toggling the camera flash and
 *              switching between front and back camera. It uses icon buttons for user interactions.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

import { View } from "react-native";
import IconButton from "../IconButton";

/**
 * Props for CameraTools component
 * 
 * @interface CameraToolsProps
 * @property {boolean} cameraTorch - Indicates if the camera flash (torch) is currently enabled.
 * @property {React.Dispatch<React.SetStateAction<"front" | "back">>} setCameraFacing - Function to toggle the camera facing direction.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setCameraTorch - Function to toggle the camera torch state.
 */
interface CameraToolsProps {
  cameraTorch: boolean;
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * CameraTools component
 * 
 * This component renders a set of tools for the camera view. It includes:
 * - A button to toggle between the front and back cameras.
 * - A button to toggle the camera torch (flash).
 * 
 * @param {CameraToolsProps} props - The properties passed to the component.
 * @returns {React.ReactElement} The rendered CameraTools component.
 */
export default function CameraTools({
  cameraTorch,
  setCameraFacing,
  setCameraTorch,
}: CameraToolsProps) {
  return (
    <View
      style={{
        position: "absolute",
        right: 6,
        zIndex: 1,
        gap: 16,
      }}
    >
      <IconButton
        onPress={() =>
          setCameraFacing((prevValue) =>
            prevValue === "back" ? "front" : "back"
          )
        }
        iosName={"arrow.triangle.2.circlepath.camera"}
        androidName="close"
        width={25}
        height={21}
      />
      <IconButton
        onPress={() =>
          setCameraTorch((prevValue) => !prevValue)
        }
        iosName={cameraTorch ? "bolt.circle" : "bolt.slash.circle"}
        androidName="close"
      />
    </View>
  );
}
