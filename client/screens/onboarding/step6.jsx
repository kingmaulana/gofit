import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useController, useFormContext} from "react-hook-form";
import {Text, TextInput, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";

export default function Step6({onNext}) {
  const {control, getValues} = useFormContext();
  const heightInput = useController({
    name: "height",
    control: control,
    defaultValue: "",
  })

  const handleNext = () => {
    const height = getValues("height");
    if (!height || height < 80 || height > 300) {
      return;
    }

    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <View className="flex-1">
        <Text className="text-white">May I know your height?</Text>
        <View className="">
          <TextInput
            value={heightInput.field.value}
            onChangeText={heightInput.field.onChange}
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