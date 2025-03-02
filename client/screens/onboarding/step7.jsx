import OnboardingLayout from "@/components/screens/onboarding-layout";
import {ScrollView, Text, View} from "react-native";
import {Pressable} from "@/components/ui/pressable";
import {useFormContext} from "react-hook-form";

export default function Step7({onNext}) {
  const {setValue, getValues} = useFormContext();
  const handleActivityClick = (value) => {
    setValue("activity", value);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white">What is your activity level?</Text>
      <ScrollView>
        <Pressable onPress={() => handleActivityClick("beginner")}>
          <Text className={getValues("activity") === "beginner" ? "text-orange-500" : "text-white"}>Beginner</Text>
        </Pressable>
        <Pressable onPress={() => handleActivityClick("advanced")}>
          <Text className={getValues("activity") === "build-muscle" ? "text-orange-500" : "text-white"}>Advance</Text>
        </Pressable>
        <Pressable onPress={() => handleActivityClick("expert")}>
          <Text className={getValues("activity") === "expert" ? "text-orange-500" : "text-white"}>Expert</Text>
        </Pressable>
      </ScrollView>
    </View>
  </OnboardingLayout>
}