import {Text, TextInput, View} from "react-native";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Button, ButtonText} from "@/components/ui/button";
import {useForm} from "react-hook-form";

export default function LoginView() {
  const form = useForm();

  return <OnboardingLayout>
    <View>
      <View>
        <Text className="text-white">Email</Text>
        <TextInput
          className="p-2 border border-white text-white rounded-md"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
      <View>
        <Text className="text-white">Password</Text>
        <TextInput
          className="p-2 border border-white text-white rounded-md"
          autoCapitalize="none"
          secureTextEntry={true}
        />
      </View>
      <Button action="secondary" size="xl" style={{
        marginVertical: 16,
      }}>
        <ButtonText>Login</ButtonText>
      </Button>
    </View>
  </OnboardingLayout>
}