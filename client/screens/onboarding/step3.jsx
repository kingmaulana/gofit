import OnboardingLayout from "@/components/screens/onboarding-layout";
import { ScrollView, Text, View, StyleSheet, Animated, Easing } from "react-native";
import PropTypes from "prop-types";
import { Pressable } from "@/components/ui/pressable";
import { useFormContext } from "react-hook-form";
import SelectionButton from "@/components/screens/onboarding-button-selection";
import { Box } from "@/components/ui/box";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";

export default function Step3({ onNext }) {
  const { setValue, getValues } = useFormContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.quad),
      }),
    ]).start();
  }, []);

  const handleGoalClick = (value) => {
    setValue("goal", value);
    onNext();
  };

  return (
    <OnboardingLayout>
      <LinearGradient
        colors={['#1A1A1A', '#2C2C2C', '#1A1A1A']}
        style={styles.container}
      >
        <Animated.View style={[styles.contentWrapper, {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }]}>
          {/* Heading */}
          <Text style={styles.headerText}>What is your main goal when using GoFit?</Text>
          <Text style={styles.subHeaderText}>Choose the option that best matches your fitness journey</Text>

        {/* Goal Selection Buttons */}
        <ScrollView contentContainerStyle={styles.selectionContainer}>
          <View style={styles.buttonsWrapper}>
            <Pressable onPress={() => handleGoalClick("lose-weight")} style={styles.buttonContainer}>
              <LinearGradient
                colors={getValues("goal") === "lose-weight" ? ['#FF6B6B', '#FF8E8E'] : ['#2C2C2C', '#3D3D3D']}
                style={[styles.selectionButton, getValues("goal") === "lose-weight" && styles.selectedButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="scale-bathroom" size={24} color={getValues("goal") === "lose-weight" ? "#FFF" : "#888"} />
                <Text style={[styles.buttonText, getValues("goal") === "lose-weight" && styles.selectedText]}>
                  I want to lose some weight
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => handleGoalClick("build-muscle")} style={styles.buttonContainer}>
              <LinearGradient
                colors={getValues("goal") === "build-muscle" ? ['#4A90E2', '#5C9CE5'] : ['#2C2C2C', '#3D3D3D']}
                style={[styles.selectionButton, getValues("goal") === "build-muscle" && styles.selectedButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="weight-lifter" size={24} color={getValues("goal") === "build-muscle" ? "#FFF" : "#888"} />
                <Text style={[styles.buttonText, getValues("goal") === "build-muscle" && styles.selectedText]}>
                  I want to build some muscle
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => handleGoalClick("keep-fit")} style={styles.buttonContainer}>
              <LinearGradient
                colors={getValues("goal") === "keep-fit" ? ['#50C878', '#63D88E'] : ['#2C2C2C', '#3D3D3D']}
                style={[styles.selectionButton, getValues("goal") === "keep-fit" && styles.selectedButton]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="heart-pulse" size={24} color={getValues("goal") === "keep-fit" ? "#FFF" : "#888"} />
                <Text style={[styles.buttonText, getValues("goal") === "keep-fit" && styles.selectedText]}>
                  I just want to keep healthy and fit
                </Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView>
        </Animated.View>
      </LinearGradient>
    </OnboardingLayout>
  );
}

Step3.propTypes = {
  onNext: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 10,
    width: "90%",
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subHeaderText: {
    fontSize: 16,
    color: "#AAA",
    textAlign: "center",
    marginBottom: 40,
    width: "80%",
    letterSpacing: 0.3,
  },
  selectionContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20, // Ensure there's padding at the bottom of the selection container
  },
  buttonsWrapper: {
    flexDirection: "column", // Stack buttons vertically
    gap: 25, // Increased space between buttons for better separation
    marginTop: 20,
    width: "100%",
    alignItems: "center", // Ensure buttons are centered
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 8,
  },
  selectionButton: {
    width: "85%",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    minHeight: 70,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  selectedButton: {
    borderWidth: 0,
    transform: [{ scale: 1.02 }],
  },
  buttonText: {
    fontSize: 18,
    color: "#CCC",
    marginLeft: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
  selectedText: {
    color: "#FFF",
    fontWeight: "600",
  },
});
