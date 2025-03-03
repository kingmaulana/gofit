import OnboardingLayout from "@/components/screens/onboarding-layout";
import {ScrollView, Text, TextInput, View} from "react-native";
import {useController, useFormContext} from "react-hook-form";
import {Button, ButtonSpinner, ButtonText} from "@/components/ui/button";
import {Alert, AlertIcon, AlertText} from "@/components/ui/alert";
import {AlertCircleIcon} from "@/components/ui/icon";
import {Link, LinkText} from "@/components/ui/link";
import {HStack} from "@/components/ui/hstack";
import {Text as UIText} from "@/components/ui/text";
import {gql, useLazyQuery} from "@apollo/client";
import {useState} from "react";

const CHECK_USERNAME = gql(`
    query CheckUser($email: String, $username: String) {
        checkUser(email: $email, username: $username) {
            message
            success
        }
    }
`)

export default function Step1({onNext, onLogin}) {
  const {control, getValues} = useFormContext();
  const [error, setError] = useState(null);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);

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

  const [checkUsername, {_, loading, __}] = useLazyQuery(CHECK_USERNAME, {
    fetchPolicy: 'network-only'
  });

  const handleNext = async () => {
    try {
      setError(null);
      setUserAlreadyExists(false);
      const {name, email, username, password} = getValues();

      if (!name || !email || !username || !password) {
        setError("Please fill all fields.");
        return;
      }
      if (password.length < 5) {
        setError("Password must be at least 5 characters long.");
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Invalid email format.");
        return;
      }

      const {data, error: queryError} = await checkUsername({
        variables: {
          email,
          username
        }
      });

      if (queryError) {
        setError("An error occurred while checking username availability.");
        console.error(queryError);
        return;
      }

      if (!data.checkUser.success) {
        setError("User already exists. ");
        setUserAlreadyExists(true);
        return;
      } else {
        onNext();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  }

  return <OnboardingLayout>
    <View className="p-4 gap-2 flex-1">
      <View className="flex-1 flex-col justify-center gap-2">
        {error && <Alert className="mb-4" action="error">
          <AlertIcon as={AlertCircleIcon}/>
          <AlertText className="px-4">
            <HStack>
              <UIText>{error}</UIText>
              {userAlreadyExists &&
                <Link onPress={onLogin}>
                  <LinkText>Login</LinkText>
                </Link>
              }
            </HStack>
          </AlertText>
        </Alert>
        }
        <ScrollView className="flex-1">
          <View className="gap-4">
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
        </ScrollView>
      </View>
      <View className="flex-grow-0">
        <Button action="secondary" onPress={handleNext} disabled={loading}>
          {loading && <ButtonSpinner/>}
          <ButtonText>Next</ButtonText>
        </Button>
      </View>
    </View>
  </OnboardingLayout>
}