import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {View} from "react-native";

export default function ReviewStep({onNext}) {
  const {getValues} = useFormContext();

  return <OnboardingLayout>
    <View className="flex-1 flex-col justify-center items-center">
      <View style={{
        marginVertical: 32,
        marginHorizontal: 16
      }}>
        <Text className="text-white text-4xl mb-4 font-black">Hello {getValues("name") || "guest"}, </Text>
        <Text className="text-white text-4xl">Let's become fit with GoFit</Text>
      </View>
      <Button onPress={onNext} action="secondary" size="xl">
        <ButtonText>Let's get started!</ButtonText>
      </Button>
    </View>
  </OnboardingLayout>
}