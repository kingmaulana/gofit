import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useController, useFormContext} from "react-hook-form";
import {Text, TextInput, View} from "react-native";
import {Button, ButtonText} from "@/components/ui/button";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {InfoIcon} from "@/components/ui/icon";

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
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl font-bold">How tall are you?</Text>
        <View className="items-center justify-center mt-4">
          <View className="flex-row gap-2 justify-center">
            <TextInput
              value={heightInput.field.value}
              onChangeText={heightInput.field.onChange}
              className="p-2 border border-white text-white rounded-md text-xl"
              style={{
                width: 72
              }}
              keyboardType="number-pad"
              autoFocus
            />
            <Text className="text-white text-xl py-2">cm</Text>
          </View>
        </View>
        <Alert className="mt-4" action="info">
          <AlertIcon as={InfoIcon}/>
          <AlertText style={{
            marginRight: 20
          }}>This data is used only for BMI calculation purposes only and never be used for targeting you with
            ads</AlertText>
        </Alert>
      </View>
      <View>
        <Button onPress={handleNext} action="secondary">
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}