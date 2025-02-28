import {Button, ButtonText} from "@/components/ui/button";
import {Link, LinkText} from "@/components/ui/link";
import {Text} from "@/components/ui/text";
import {HStack} from "@/components/ui/hstack";
import OnboardingLayout from "@/components/screens/onboarding-layout";

export default function WelcomeScreen({onRegisterClick}) {
  return <OnboardingLayout>
      <Text className="text-white">Welcome to GoFit</Text>
      <Button action="secondary" onPress={onRegisterClick}>
        <ButtonText>Let's get started</ButtonText>
      </Button>
      <HStack>
        <Text className="text-white">Already have account? </Text><Link><LinkText>Login</LinkText></Link>
      </HStack>
  </OnboardingLayout>
}