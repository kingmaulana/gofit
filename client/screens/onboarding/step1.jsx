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
  const usernameInput = useController({
    name: "username",
    control: control,
  });
  const passwordInput = useController({
    name: "password",
    control: control,
  });

  const handleNext = async () => {
    // TODO: Implement username check
    const {name, email, password} = getValues();
    if (!name || !email || !password) {
      return;
    }
    if (password.length < 5) {
      return;
    }
    onNext();
  }

  return <OnboardingLayout>
    <View className="p-4 gap-2 flex-1">
      <View className="flex-1 flex-col gap-2 justify-center">
        <View className="gap-2 px-4">
          <Text className="text-white text-xl">What is your name?</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md text-lg"
            value={nameInput.field.value}
            onChangeText={nameInput.field.onChange}
          />
        </View>
        <View className="gap-2 px-4">
          <Text className="text-white text-xl">What is your email?</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md text-lg"
            value={emailInput.field.value}
            onChangeText={emailInput.field.onChange}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View className="gap-2 px-4">
          <Text className="text-white text-xl">Pick your username</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md text-lg"
            value={usernameInput.field.value}
            onChangeText={usernameInput.field.onChange}
            autoCapitalize="none"
          />
        </View>
        <View className="gap-2 px-4">
          <Text className="text-white text-xl">Type your password</Text>
          <TextInput
            className="p-2 border border-white text-white rounded-md text-lg"
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