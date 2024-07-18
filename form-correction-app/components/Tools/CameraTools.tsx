import { View } from "react-native";
import IconButton from "../IconButton";
import { FlashMode } from "expo-camera";

interface CameraToolsProps {
  cameraTorch: boolean;
  setCameraFacing: React.Dispatch<React.SetStateAction<"front" | "back">>;
  setCameraTorch: React.Dispatch<React.SetStateAction<boolean>>;
}

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