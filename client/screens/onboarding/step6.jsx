import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useController, useFormContext} from "react-hook-form";
import {Text, TextInput, View, Animated} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";
import {InfoIcon} from "@/components/ui/icon";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';

export default function Step6({onNext}) {
  const {control, getValues} = useFormContext();
  const heightInput = useController({
    name: "height",
    control: control,
    defaultValue: "",
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNext = () => {
    const height = getValues("height");
    if (!height || height < 80 || height > 300) {
      return;
    }

    onNext();
  }

  return <OnboardingLayout>
    <LinearGradient
      colors={['#1a1a2e', '#16213e']}
      className="flex-1"
    >
      <Animated.View 
        className="p-4 flex-col gap-2 flex-1"
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }]
        }}
      >
        <View className="flex-1 justify-center items-center">
          <Text className="text-white text-3xl font-bold text-center"
            style={{ textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
            How tall are you?
          </Text>
          <Text className="text-gray-300 text-base mt-2 text-center px-6">
            Let's get your height to calculate your BMI and personalize your fitness journey
          </Text>
          
          <View className="items-center justify-center mt-8">
            <View className="bg-white/10 p-4 rounded-xl">
              <View className="flex-row items-center gap-3">
                <MaterialCommunityIcons name="human-male-height" size={24} color="rgba(255,255,255,0.7)" />
                <View className="flex-row gap-2 items-center">
                  <TextInput
                    value={heightInput.field.value}
                    onChangeText={heightInput.field.onChange}
                    className="p-3 bg-white/15 text-white rounded-lg text-2xl text-center font-semibold"
                    style={{
                      width: 90,
                    }}
                    placeholder="000"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="number-pad"
                    autoFocus
                  />
                  <Text className="text-white/90 text-xl">cm</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mt-8 w-full px-4">
            <View className="bg-white/5 rounded-lg p-4">
              <View className="flex-row items-start">
                <Text className="flex-1 ml-3 text-white/70 text-sm">
                  This data is used only for BMI calculation purposes and will never be used for targeting you with ads
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-4">
          <Button 
            onPress={handleNext}
            className="bg-blue-500 rounded-lg"
          >
            <View className="flex-row items-center justify-center gap-2">
              <ButtonText className="text-lg">Continue</ButtonText>
              <MaterialCommunityIcons name="arrow-right" size={20} color="white" />
            </View>
          </Button>
        </View>
      </Animated.View>
    </LinearGradient>
  </OnboardingLayout>
}