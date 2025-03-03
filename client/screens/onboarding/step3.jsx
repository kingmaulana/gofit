import OnboardingLayout from "@/components/screens/onboarding-layout";
import {ScrollView, Text, View} from "react-native";
import PropTypes from "prop-types";
import {Pressable} from "@/components/ui/pressable";
import {useFormContext} from "react-hook-form";
import SelectionButton from "@/components/screens/onboarding-button-selection";

export default function Step3({onNext}) {
  const {setValue, getValues} = useFormContext();
  const handleGoalClick = (value) => {
    setValue("goal", value);
    onNext();
  }
  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white text-3xl text-center" style={{
        marginVertical: 32
      }}>What is your main goal when using GoFit?</Text>
      <View className="flex-row justify-center" style={{
        display: "relative",
        height: 300
      }}>
        <View className="gap-4 mt-4">
          <SelectionButton
            value="lose-weight"
            selectedValue={getValues("goal")}
            onPress={handleGoalClick}
            verticalMode
          >
            I want to lose some weight
          </SelectionButton>
          <SelectionButton
            value="build-muscle"
            selectedValue={getValues("goal")}
            onPress={handleGoalClick}
            verticalMode
          >
            I want to build some muscle
          </SelectionButton>
          <SelectionButton
            value="keep-fit"
            selectedValue={getValues("goal")}
            onPress={handleGoalClick}
            verticalMode
          >
            I just want to keep healthy and fit
          </SelectionButton>
        </View>
      </View>
    </View>
  </OnboardingLayout>
}

Step3.propTypes = {
  onNext: PropTypes.func.isRequired
}