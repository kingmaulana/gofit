import {ScrollView, Text, TextInput, View, StyleSheet} from "react-native";
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
import { useNavigation } from '@react-navigation/native';

const LOGIN = gql(`
    mutation Mutation($email: String, $password: String) {
        login(email: $email, password: $password) {
            access_token
        }
    }
`)

export default function LoginView() {
  const navigation = useNavigation();
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

  return (
    <OnboardingLayout>
      <View style={styles.container}>
        {/* Heading */}
        <Text style={styles.headerText}>Login to GoFit</Text>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6" action="error">
            <AlertIcon as={AlertCircleIcon} />
            <AlertText className="px-4">
              <HStack>
                <UIText>{error.message}</UIText>
              </HStack>
            </AlertText>
          </Alert>
        )}

        {/* Form */}
        <ScrollView contentContainerStyle={{flex: 1}}>

          <View style={styles.formContainer}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                value={emailInput.field.value}
                onChangeText={emailInput.field.onChange}
                placeholder="Enter your email"
                placeholderTextColor="#ccc"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                secureTextEntry={true}
                value={passwordInput.field.value}
                onChangeText={passwordInput.field.onChange}
                placeholder="Enter your password"
                placeholderTextColor="#ccc"
              />
            </View>

            {/* Submit Button */}
            <View style={styles.buttonContainer}>
              <Button
                action="secondary"
                size="xl"
                style={styles.button}
                onPress={form.handleSubmit(handleLogin)}
                disabled={loading}
              >
                {loading && <ButtonSpinner />}
                <ButtonText className="text-white">Login</ButtonText>
              </Button>
            </View>

            {/* Register Link */}
            <View style={styles.linkContainer}>
              <Text style={styles.text}>Don't have an account? </Text>
              <HStack>
                <UIText style={styles.linkText}  onPress={() => navigation.navigate("AddExercisePage")}>
                  Register
                </UIText>
              </HStack>
            </View>
          </View>

        </ScrollView>
      </View>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1E1E1E',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 32,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    color: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
  },
  buttonContainer: {
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#020617',
    borderRadius: 8,
    paddingHorizontal: 40,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  text: {
    color: '#FFF',
    fontSize: 16,
  },
  linkText: {
    color: '#3A6F85',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
