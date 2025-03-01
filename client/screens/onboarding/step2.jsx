import {Text, TextInput, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";
import {useFormContext} from "react-hook-form";
import {Pressable} from "@/components/ui/pressable";
import OnboardingLayout from "@/components/screens/onboarding-layout";

export default function Step2({onNext}) {
  const {setValue, getValues} = useFormContext();

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <View>
        <Text className="text-white">Are you male or female?</Text>
        <Pressable onPress={() => console.log("teheperinko")}>
          <Text className="text-white">Male</Text>
        </Pressable>
      </View>
    </View>
  </OnboardingLayout>
}