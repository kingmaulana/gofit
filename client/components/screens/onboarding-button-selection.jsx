import React from "react";
import {View, Text} from "react-native";
import {Pressable} from "@/components/ui/pressable";
import PropTypes from "prop-types";

export default function SelectionButton({ value, selectedValue, onPress, children, verticalMode }) {
  const isSelected = selectedValue === value;

  return (
    <View
      className={`border ${isSelected ? "border-2 border-info-500" : "border-white"} items-center justify-center rounded-2xl flex-1`}
      style={{
        borderRadius: 20
      }}
    >
      <Pressable
        onPress={() => onPress(value)}
        className={`w-full h-full ${!verticalMode ? "items-center" : ""} justify-center`}
      >
        <Text className={`${isSelected ? "text-info-500 font-black" : "text-white"} text-xl px-4`}>{children}</Text>
      </Pressable>
    </View>
  );
}

SelectionButton.propTypes = {
  value: PropTypes.string.isRequired,
  selectedValue: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  verticalMode: PropTypes.bool
};