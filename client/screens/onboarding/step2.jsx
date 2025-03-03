import {Text, View} from "react-native";
import {useFormContext} from "react-hook-form";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import PropTypes from "prop-types";
import SelectionButton from "@/components/screens/onboarding-button-selection";

export default function Step2({onNext}) {
  const {setValue, getValues} = useFormContext();

  const handleGenderPress = (value) => {
    setValue("gender", value);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white text-3xl text-center" style={{
        marginVertical: 32
      }}>Are you male or female?</Text>
      <View className="flex-row justify-evenly gap-4 mt-4" style={{
        display: "relative",
        height: 80
      }}>
        <SelectionButton
          value="male"
          selectedValue={getValues("gender")}
          onPress={handleGenderPress}
        >
          Male
        </SelectionButton>
        <SelectionButton
          value="female"
          displayText="Female"
          selectedValue={getValues("gender")}
          onPress={handleGenderPress}
        >
          Female
        </SelectionButton>
      </View>
    </View>
  </OnboardingLayout>
}

Step2.propTypes = {
  onNext: PropTypes.func.isRequired
}