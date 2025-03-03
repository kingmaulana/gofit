import {Button, ButtonText} from "@/components/ui/button";
import {Link, LinkText} from "@/components/ui/link";
import {Text} from "@/components/ui/text";
import {HStack} from "@/components/ui/hstack";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";

export default function WelcomeScreen({onRegisterClick}) {
  const navigation = useNavigation();

  return <OnboardingLayout>
    <View className="flex-1 flex-col justify-center items-center">
      <Text className="text-white text-6xl text-center" style={{
        marginVertical: 32
      }}>Welcome to GoFit</Text>
      <Button action="secondary" onPress={onRegisterClick} size="xl" style={{
        marginVertical: 16,
      }}>
        <ButtonText>Let's get started</ButtonText>
      </Button>
      <HStack>
        <Text className="text-white">Already have account? </Text>
        <Link onPress={() => navigation.navigate('Login')}>
          <LinkText>Login</LinkText>
        </Link>
      </HStack>
    </View>
  </OnboardingLayout>
}