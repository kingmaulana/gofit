import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, StatusBar, StyleSheet, View} from 'react-native';
import WelcomeScreen from "@/screens/onboarding/step0";
import {FormProvider, useForm} from "react-hook-form";
import Step1 from "@/screens/onboarding/step1";
import Step2 from "@/screens/onboarding/step2";
import Step4 from "@/screens/onboarding/step4";
import Step3 from "@/screens/onboarding/step3";
import Step5 from "@/screens/onboarding/step5";
import Step6 from "@/screens/onboarding/step6";
import Step7 from "@/screens/onboarding/step7";
import Step8 from "@/screens/onboarding/step8";
import Step9 from "@/screens/onboarding/step9";
import ReviewStep from "@/screens/onboarding/review";

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

  const handleOnboardingSubmit = async (data) => {
    console.log(data);
  }

  return (
    <FormProvider {...form}>
      <View className="flex-1">
        <View className="flex-1">
          {/* Login / Register */}
          {step === 0 && <WelcomeScreen onRegisterClick={() => setStep(1)}/>}
          {/* If choose register, go to step 1: biodata */}
          {step === 1 && <Step1 onNext={() => setStep(2)}/>}
          {/* Step 2: gender */}
          {step === 2 && <Step2 onNext={() => setStep(3)}/>}
          {/* Step 3: goal */}
          {step === 3 && <Step3 onNext={() => setStep(4)}/>}
          {/* Step 4: berat badan */}
          {step === 4 && <Step4 onNext={() => setStep(5)}/>}
          {/* Step 5: umur */}
          {step === 5 && <Step5 onNext={() => setStep(6)}/>}
          {/* Step 6: tinggi */}
          {step === 6 && <Step6 onNext={() => setStep(7)}/>}
          {/* Step 7: preferensi */}
          {step === 7 && <Step7 onNext={() => setStep(8)}/>}
          {/* Step 8: workout berapa kali */}
          {step === 8 && <Step8 onNext={() => setStep(9)}/>}
          {/* Step 9: review */}
          {step === 9 && <ReviewStep onNext={form.handleSubmit(handleOnboardingSubmit)}/>}
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