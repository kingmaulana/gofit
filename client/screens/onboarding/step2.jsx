import {Text, TextInput, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";
import {useFormContext} from "react-hook-form";
import {Pressable} from "@/components/ui/pressable";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import PropTypes from "prop-types";

export default function Step2({onNext}) {
  const {setValue, getValues} = useFormContext();

  const handleGenderPress = (value) => {
    setValue("gender", value);
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2">
      <Text className="text-white">Are you male or female?</Text>
      <View>
        <Pressable onPress={() => handleGenderPress("male")}>
          <Text className={getValues("gender") === "male" ? "text-orange-500" : "text-white"}>Male</Text>
        </Pressable>
        <Pressable onPress={() => handleGenderPress("female")}>
          <Text className={getValues("gender") === "female" ? "text-orange-500" : "text-white"}>Female</Text>
        </Pressable>
      </View>
    </View>
  </OnboardingLayout>
}

Step2.propTypes = {
  onNext: PropTypes.func.isRequired
}