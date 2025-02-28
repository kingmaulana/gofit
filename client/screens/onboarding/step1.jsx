import OnboardingLayout from "@/components/screens/onboarding-layout";
import {TextInput, View, Text} from "react-native";
import {useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";

export default function Step1({onNext}) {
  const form = useFormContext();

  const handleNext = () => {
    // TODO: Implement username check
    onNext();
  }

  return <OnboardingLayout>
      <View className="p-4 flex-col gap-2">
        <View>
          <Text className="text-white">What is your name?</Text>
          <TextInput className="p-2 border border-white text-white rounded-md"/>
        </View>
        <View>
          <Text className="text-white">What is your email?</Text>
          <TextInput className="p-2 border border-white text-white rounded-md"/>
        </View>
        <View>
          <Text className="text-white">Can you type your password</Text>
          <TextInput className="p-2 border border-white text-white rounded-md"/>
        </View>
      </View>
      <View className="flex-grow-0">
        <Button action="secondary" onPress={handleNext}>
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
  </OnboardingLayout>
}