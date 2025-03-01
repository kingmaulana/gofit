import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform, StatusBar, BackHandler} from 'react-native';
import {Button, ButtonText} from "@/components/ui/button";
import WelcomeScreen from "@/screens/onboarding/step0";
import {FormProvider, useForm} from "react-hook-form";
import Step1 from "@/screens/onboarding/step1";
import Step2 from "@/screens/onboarding/step2";

const OnboardingFlow = () => {
  const form = useForm();
  // Max: 9 steps
  const [step, setStep] = useState(0);

  const handlePrevious = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const backAction = () => {
      if (step > 0) {
        handlePrevious();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [step]);

  return (
    <FormProvider {...form}>
      <View className="flex-1">
        <View className="flex-1">
          {/* Login / Register */}
          {step === 0 && <WelcomeScreen onRegisterClick={() => setStep(1)}/>}
          {/* If choose register, go to step 1: biodata */}
          {step === 1 && <Step1 onNext={() => setStep(2)} />}
          {/* Step 2: gender */}
          {step === 2 && <Step2 onNext={() => setStep(3)} />}
          {/* Step 3: goal */}
          {step === 3 && (
            <Text>Step 3: You're all set!</Text>
          )}
          {/* Step 4: berat badan */}
          {/* Step 5: umur */}
          {/* Step 6: tinggi */}
          {/* Step 7: preferensi  */}
          {/* Step 8: workout berapa kali */}
          {/* Step 9: nama email password */}
          {/* Step 10: review */}
        </View>
      </View>
    </FormProvider>
  );
};

export const style = StyleSheet.create({
  AndroidSafeArea: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

export default OnboardingFlow;