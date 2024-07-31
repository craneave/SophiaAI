/**
 * @file icon_button.tsx
 * 
 * @description This component renders a customizable icon button that supports both iOS and Android icon sets.
 *              It is designed to handle touch interactions and provide visual feedback with configurable size 
 *              and styles.
 * 
 * @version 1.0.0
 * @date 2024-07-31
 * @author Avery Crane
 */

/* Import necessary modules and components */
import { ComponentProps } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SFSymbol, SymbolView } from "expo-symbols";
import { StyleProp, TouchableOpacity, ViewStyle } from "react-native";

/* Constants for styling */
const CONTAINER_PADDING = 5;
const CONTAINER_WIDTH = 34;
const ICON_SIZE = 25;

/* Interface for IconButton props */
interface IconButtonProps {
  iosName: SFSymbol;  // Symbol name for iOS icons
  androidName: ComponentProps<typeof Ionicons>["name"];  // Icon name for Android icons
  containerStyle?: StyleProp<ViewStyle>;  // Optional style for the container
  onPress?: () => void;  // Optional function to be called on press
  width?: number;  // Optional width for the icon
  height?: number;  // Optional height for the icon
}

/* IconButton component */
export default function IconButton({
  onPress,
  androidName,
  iosName,
  containerStyle,
  height,
  width,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.5}
      style={[
        {
          backgroundColor: "#00000050",
          padding: CONTAINER_PADDING,
          borderRadius: (CONTAINER_WIDTH + CONTAINER_PADDING * 2) / 2,
          width: CONTAINER_WIDTH,
        },
        containerStyle,
      ]}
    >
      <SymbolView
        name={iosName}
        size={ICON_SIZE}
        style={
          width && height 
            ? {
                width,
                height,
              }
            : {}
        }
        tintColor={"white"}
        fallback={
          <Ionicons
            size={ICON_SIZE}
            name={androidName}
            style={{}}
            color={"white"}
          />
        }
      />
    </TouchableOpacity>
  );
}
