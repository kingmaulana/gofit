import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Button, ButtonText} from "@/components/ui/button";
import {View, Text, TextInput} from "react-native";
import {useController, useFormContext} from "react-hook-form";

export default function Step4({onNext}) {
  const {control, getValues} = useFormContext();
  const weightInput = useController({
    name: "weight",
    control: control,
    defaultValue: "",
  })

  const handleNext = () => {
    const weight = getValues("weight");
    if (!weight || weight < 0 || weight > 300) {
      return;
    }

    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <View className="flex-1">
        <Text className="text-white">How much do you weigh?</Text>
        <View className="">
          <TextInput
            value={weightInput.field.value}
            onChangeText={weightInput.field.onChange}
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