import OnboardingLayout from "@/components/screens/onboarding-layout";
import { useController, useFormContext } from "react-hook-form";
import { Text, TextInput, View, Animated } from "react-native";
import { Button, ButtonText } from "@/components/ui/button";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Step5({onNext}) {
  const {control, getValues} = useFormContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const ageInput = useController({
    name: "age",
    control: control,
    defaultValue: "",
  })

  const handleNext = () => {
    const age = getValues("age");
    if (!age || age < 0 || age > 250) {
      return;
    }

    onNext();
  }

  return <OnboardingLayout>
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#1a1a2e']}
      className="flex-1"
    >
      <Animated.View 
        className="p-6 flex-col gap-4 flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-3xl font-bold text-center mb-2"
            style={{ textShadowColor: 'rgba(0, 0, 0, 0.4)', textShadowOffset: {width: 0, height: 2}, textShadowRadius: 4 }}>
            Age Confirmation
          </Text>
          <Text className="text-gray-300 text-base text-center mb-8 px-6">
            Help us personalize your fitness journey by providing your age
          </Text>
          
          <LinearGradient
            colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
            className="p-6 rounded-2xl w-full"
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <View className="items-center justify-center">
              <View className="flex-row items-center justify-center gap-3">
                <MaterialCommunityIcons name="calendar-account" size={24} color="#fff" />
                <Text className="text-white text-xl font-medium">I am </Text>
                <TextInput
                  value={ageInput.field.value}
                  onChangeText={ageInput.field.onChange}
                  className="px-4 py-2 bg-[rgba(255,255,255,0.1)] text-white rounded-xl text-xl text-center"
                  style={{
                    width: 70,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}
                  keyboardType="number-pad"
                  autoFocus
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  placeholder="00"
                />
                <Text className="text-white text-xl font-medium">years old</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        <View className="mb-4">
          <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            className="rounded-xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 0, height: 4},
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Button 
              onPress={handleNext}
              style={{
                backgroundColor: 'transparent',
              }}
            >
              <View className="flex-row items-center justify-center gap-2">
                <ButtonText className="text-lg font-semibold">Continue</ButtonText>
                <MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />
              </View>
            </Button>
          </LinearGradient>
        </View>
      </Animated.View>
    </LinearGradient>
  </OnboardingLayout>
}