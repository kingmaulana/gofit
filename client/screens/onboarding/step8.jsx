import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Text, View} from "react-native";
import {useFormContext} from "react-hook-form";
import SelectionButton from "@/components/screens/onboarding-button-selection";

export default function Step8({onNext}) {
  const {setValue, getValues} = useFormContext();
  const handleActivityClick = (value) => {
    setValue("activity", value);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white text-3xl text-center" style={{
        marginVertical: 32
      }}>Choose your activity level</Text>
      <View className="flex-row justify-center" style={{
        display: "relative",
        height: 300
      }}>
        <View className="gap-4 mt-4">
          <SelectionButton
            value="beginner"
            selectedValue={getValues("activity")}
            onPress={handleActivityClick}
            verticalMode
          >
            I am a beginner and only want to exercise lightly
          </SelectionButton>
          <SelectionButton
            value="advanced"
            selectedValue={getValues("activity")}
            onPress={handleActivityClick}
            verticalMode
          >
            I already have some experience and want to exercise regularly
          </SelectionButton>
          <SelectionButton
            value="expert"
            selectedValue={getValues("activity")}
            onPress={handleActivityClick}
            verticalMode
          >
            I am an expert and want to push myself to the limit
          </SelectionButton>
        </View>
      </View>
    </View>
  </OnboardingLayout>
}