import OnboardingLayout from "@/components/screens/onboarding-layout";
import {useFormContext} from "react-hook-form";
import {Button, ButtonText} from "@/components/ui/button";
import {Text} from "@/components/ui/text";
import {View} from "react-native";
import {gql, useMutation} from "@apollo/client";
import {storeSecure} from "@/helpers/secure";

const REGISTER = gql(`
    mutation Register($username: String, $name: String, $email: String, $password: String, $weight: Int, $height: Int, $age: Int, $gender: String, $activity: String, $goal: String, $bmi: Int, $goalWeight: Int, $endGoal: String, $injuries: [String]) {
        register(username: $username, name: $name, email: $email, password: $password, weight: $weight, height: $height, age: $age, gender: $gender, activity: $activity, goal: $goal, bmi: $bmi, goalWeight: $goalWeight, endGoal: $endGoal, injuries: $injuries) {
            access_token
        }
    }
`)

export default function ReviewStep() {
  const form = useFormContext();
  const [register] = useMutation(REGISTER);

  const handleOnboardingSubmit = async (data) => {
    data.weight = parseFloat(data.weight);
    data.height = parseFloat(data.height);
    data.age = parseInt(data.age);
    data.bmi = parseInt(data.bmi);
    data.goalWeight = parseInt(data.goalWeight);

    try {
      const {data: result} = await register({
        variables: data
      });
      const token = result.register.access_token;
      await storeSecure("token", token);
    } catch (e) {
      console.error(e);
    }
  }

  return <OnboardingLayout>
    <View className="flex-1 flex-col justify-center items-center">
      <View style={{
        marginVertical: 32,
        marginHorizontal: 16
      }}>
        <Text className="text-white text-4xl mb-4 font-black">Hello {form.getValues("name") || "guest"}, </Text>
        <Text className="text-white text-4xl">Let's become fit with GoFit</Text>
      </View>
      <Button onPress={form.handleSubmit(handleOnboardingSubmit)} action="secondary" size="xl">
        <ButtonText>Let's get started!</ButtonText>
      </Button>
    </View>
  </OnboardingLayout>
}