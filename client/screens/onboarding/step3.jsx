import OnboardingLayout from "@/components/screens/onboarding-layout";
import {ScrollView, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Pressable} from "@/components/ui/pressable";
import {useFormContext} from "react-hook-form";

export default function Step3({onNext}) {
  const {setValue, getValues} = useFormContext();
  const handleGoalClick = (value) => {
    setValue("goal", value);
    onNext();
  }
  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white">What's your main goal?</Text>
      <ScrollView>
        <Pressable onPress={() => handleGoalClick("lose-weight")}>
          <Text className={getValues("goal") === "lose-weight" ? "text-orange-500" : "text-white"}>I want to lose some weight</Text>
        </Pressable>
        <Pressable onPress={() => handleGoalClick("build-muscle")}>
          <Text className={getValues("goal") === "build-muscle" ? "text-orange-500" : "text-white"}>I want to build some muscle</Text>
        </Pressable>
        <Pressable onPress={() => handleGoalClick("keep-fit")}>
          <Text className={getValues("goal") === "keep-fit" ? "text-orange-500" : "text-white"}>I want to stay fit</Text>
        </Pressable>
      </ScrollView>
    </View>
  </OnboardingLayout>
}

Step3.propTypes = {
  onNext: PropTypes.func.isRequired
}