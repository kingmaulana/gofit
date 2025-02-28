import {Image, Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import PropTypes from "prop-types";

export default function OnboardingLayout({children, style, className, statusBarStyle, image}) {
  return <>
    <View className={`bg-black flex-1 relative ${className || ""}`} style={style}>
      {image && <Image source={{
        uri: image
      }} className="w-full h-full absolute top-0 left-0" blurRadius={5}/>
      }
      <SafeAreaView style={defaultStyle.AndroidSafeArea}>
        {children}
      </SafeAreaView>
    </View>
    <StatusBar style={statusBarStyle || "light"}/>
  </>
}

export const defaultStyle = StyleSheet.create({
  AndroidSafeArea: {
    marginTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0
  }
});

OnboardingLayout.propTypes = {
  children: PropTypes.node.isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  statusBarStyle: PropTypes.oneOf(["auto", "inverted", "light", "dark"]),
  image: PropTypes.string
}