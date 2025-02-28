import OnboardingLayout from "@/components/screens/onboarding-layout";
import {TextInput, View, Text} from "react-native";
import {useFormContext} from "react-hook-form";
import {Button} from "@/components/ui/button";

export default function Step1() {
  const form = useFormContext();
  return <OnboardingLayout>
    <View className="p-4 flex-1 flex-col gap-2">
      <View>
        <Text className="text-white">What is your name?</Text>
        <TextInput className="px-4 py-2 border border-white text-white rounded-md"/>
      </View>
      <View>
        <Text className="text-white">What is your email?</Text>
        <TextInput className="px-4 py-2 border border-white text-white rounded-md"/>
      </View>
      <View>
        <Text className="text-white">Can you type your password</Text>
        <TextInput className="px-4 py-2 border border-white text-white rounded-md"/>
      </View>
    </View>
    <View>
      <Button></Button>
    </View>
  </OnboardingLayout>
}