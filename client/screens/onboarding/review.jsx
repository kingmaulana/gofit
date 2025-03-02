import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";

export default function ReviewStep({onNext}) {
  const {getValues} = useFormContext();

  return <OnboardingLayout>
    <Button onPress={onNext}>
      <ButtonText>Submit form</ButtonText>
    </Button>
  </OnboardingLayout>
}