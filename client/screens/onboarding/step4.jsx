import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Button, ButtonText} from "@/components/ui/button";
import {View, Text, TextInput, Animated} from "react-native";
import {useController, useFormContext} from "react-hook-form";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {CheckIcon, InfoIcon} from "@/components/ui/icon";
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useRef } from 'react';

export default function Step4({onNext}) {
  const {control, getValues} = useFormContext();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const weightInput = useController({
    name: "weight",
    control: control,
    defaultValue: "",
  })

  const handleNext = () => {
    const weight = getValues("weight");
    if (!weight || weight < 0) {
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
          <Text className="text-white text-3xl font-bold mb-2" style={{ textShadowColor: 'rgba(0, 0, 0, 0.75)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}>
            How much do you weigh?
          </Text>
          <Text className="text-gray-300 text-base mb-8 text-center">
            Enter your current weight to help us calculate your BMI
          </Text>
          <View className="items-center justify-center mt-4">
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              className="p-4 rounded-2xl"
              style={{
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 4,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4.65,
                elevation: 8,
              }}
            >
              <View className="flex-row gap-4 justify-center items-center">
                <TextInput
                  value={weightInput.field.value}
                  onChangeText={weightInput.field.onChange}
                  className="p-4 bg-[#ffffff15] text-white rounded-xl text-2xl text-center"
                  style={{
                    width: 100,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                  }}
                  keyboardType="number-pad"
                  autoFocus
                  placeholderTextColor="#666"
                  placeholder="0"
                />
                <Text className="text-white text-2xl font-semibold">kg</Text>
              </View>
            </LinearGradient>
          </View>
          <View className="mt-8 w-full px-4">
            <LinearGradient
              colors={['rgba(59,130,246,0.1)', 'rgba(59,130,246,0.05)']}
              className="rounded-xl p-4"
            >
              <Alert className="bg-transparent border-0">
                <AlertIcon as={InfoIcon} color="#60a5fa"/>
                <AlertText 
                  className="text-gray-300 text-sm"
                  style={{
                    marginRight: 20,
                    lineHeight: 20,
                  }}
                >
                  This data is used only for BMI calculation purposes and will never be used for targeting you with ads
                </AlertText>
              </Alert>
            </LinearGradient>
          </View>
        </View>
        <View className="mb-4">
          <LinearGradient
            colors={['#4f46e5', '#3b82f6']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            className="rounded-xl overflow-hidden"
          >
            <Button 
              onPress={handleNext}
              style={{
                backgroundColor: 'transparent',
                transform: [{scale: weightInput.field.value ? 1 : 0.98}],
              }}
            >
              <ButtonText className="text-lg font-bold">Continue</ButtonText>
            </Button>
          </LinearGradient>
        </View>
      </Animated.View>
    </LinearGradient>
  </OnboardingLayout>
}