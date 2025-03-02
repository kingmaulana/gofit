import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useController, useFormContext} from "react-hook-form";
import {Text, TextInput, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";

export default function Step5({onNext}) {
  const {control, getValues} = useFormContext();
  const ageInput = useController({
    name: "age",
    control: control,
    defaultValue: "",
  })

  const handleNext = () => {
    const age = getValues("age");
    if (!age || age < 0 || age > 250) {
      return;
    }

    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <View className="flex-1">
        <Text className="text-white">How old are you?</Text>
        <View className="">
          <TextInput
            value={ageInput.field.value}
            onChangeText={ageInput.field.onChange}
            className="p-2 border border-white text-white rounded-md"
            keyboardType="number-pad"/>
        </View>
      </View>
      <View>
        <Button onPress={handleNext} action="secondary">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}