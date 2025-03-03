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
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl font-bold">Age confirmation</Text>
        <View className="items-center justify-center mt-4">
          <View className="flex-row gap-2 justify-center">
            <Text className="text-white text-xl py-2">I am </Text>
            <TextInput
              value={ageInput.field.value}
              onChangeText={ageInput.field.onChange}
              className="p-2 border border-white text-white rounded-md text-xl"
              style={{
                width: 60
              }}
              keyboardType="number-pad"
              autoFocus
            />
            <Text className="text-white text-xl py-2">years old</Text>
          </View>
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