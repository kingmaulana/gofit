import {ScrollView, Text, TextInput, View} from "react-native";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import {Button, ButtonSpinner, ButtonText} from "@/components/ui/button";
import {useController, useForm} from "react-hook-form";
import {gql, useMutation} from "@apollo/client";
import {useContext, useEffect} from "react";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {AlertCircleIcon} from "@/components/ui/icon";
import {HStack} from "@/components/ui/hstack";
import {Text as UIText} from "@/components/ui/text";
import {AuthContext} from "@/helpers/auth-context";

const LOGIN = gql(`
    mutation Mutation($email: String, $password: String) {
        login(email: $email, password: $password) {
            access_token
        }
    }
`)

export default function LoginView() {
  const form = useForm();
  const {handleLogin: handleAuthLogin} = useContext(AuthContext);

  const emailInput = useController({
    name: "email",
    control: form.control,
  });
  const passwordInput = useController({
    name: "password",
    control: form.control,
  });

  const [login, {_, loading, error}] = useMutation(LOGIN);

  useEffect(() => {
    return form.reset();
  }, []);

  const handleLogin = async (data) => {
    const {data: loginData} = await login({
      variables: {
        email: data.email,
        password: data.password,
      }
    });
    const token = loginData.login.access_token;
    handleAuthLogin({token});
  }

  return <OnboardingLayout>
    <View className="p-4 flex-col gap-2 flex-1">
      <Text className="text-white text-3xl text-center" style={{
        marginVertical: 32
      }}>Login to GoFit</Text>
      {error && <Alert className="mb-4" action="error">
        <AlertIcon as={AlertCircleIcon}/>
        <AlertText className="px-4">
          <HStack>
            <UIText>{error.message}</UIText>
          </HStack>
        </AlertText>
      </Alert>
      }
      <ScrollView className="flex-1">
        <View className="gap-4">
          <View className="gap-2 px-4">
            <Text className="text-white text-xl">Email</Text>
            <TextInput
              className="p-2 border border-white text-white rounded-md"
              keyboardType="email-address"
              autoCapitalize="none"
              value={emailInput.field.value}
              onChangeText={emailInput.field.onChange}
            />
          </View>
          <View className="gap-2 px-4">
            <Text className="text-white text-xl">Password</Text>
            <TextInput
              className="p-2 border border-white text-white rounded-md"
              autoCapitalize="none"
              secureTextEntry={true}
              value={passwordInput.field.value}
              onChangeText={passwordInput.field.onChange}
            />
          </View>
          <View className="gap-2 px-4">
            <Button action="secondary" size="xl" style={{
              marginVertical: 16,
            }} onPress={form.handleSubmit(handleLogin)} disabled={loading}>
              {loading && <ButtonSpinner />}
              <ButtonText>Login</ButtonText>
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  </OnboardingLayout>
}