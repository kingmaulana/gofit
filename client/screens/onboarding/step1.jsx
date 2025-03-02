import OnboardingLayout from "@/components/screens/onboarding-layout";
import {TextInput, View, Text} from "react-native";
import {useController, useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";

export default function Step1({onNext}) {
  const {control, getValues} = useFormContext();
  const nameInput = useController({
    name: "name",
    control: control,
  });
  const emailInput = useController({
    name: "email",
    control: control,
  });
  const passwordInput = useController({
    name: "password",
    control: control,
  });

  const handleNext = () => {
    // TODO: Implement username check
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 gap-2 flex-1">
      <View className="flex-1 flex-col gap-2">
        <View>
          <Text className="text-white">What is your name?</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md"
            value={nameInput.field.value}
            onChangeText={nameInput.field.onChange}
          />
        </View>
        <View>
          <Text className="text-white">What is your email?</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md"
            value={emailInput.field.value}
            onChangeText={emailInput.field.onChange}
            keyboardType="email-address"
          />
        </View>
        <View>
          <Text className="text-white">Can you type your password</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md"
            value={passwordInput.field.value}
            onChangeText={passwordInput.field.onChange}
            secureTextEntry={true}
            autoCapitalize="none"
          />
        </View>
      </View>
      <View className="flex-grow-0">
        <Button action="secondary" onPress={handleNext}>
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}