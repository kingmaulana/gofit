import OnboardingLayout from "@/components/screens/onboarding-layout";
import { ScrollView, Text, TextInput, View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useController, useFormContext } from "react-hook-form";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Alert, AlertIcon, AlertText } from "@/components/ui/alert";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Link, LinkText } from "@/components/ui/link";
import { HStack } from "@/components/ui/hstack";
import { Text as UIText } from "@/components/ui/text";
import { gql, useLazyQuery } from "@apollo/client";
import { useState } from "react";

const CHECK_USERNAME = gql(`
    query CheckUser($email: String, $username: String) {
        checkUser(email: $email, username: $username) {
            message
            success
        }
    }
`);

export default function Step1({ onNext, onLogin }) {
  const { control, getValues } = useFormContext();
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

  const [checkUsername, { _, loading, __ }] = useLazyQuery(CHECK_USERNAME, {
    fetchPolicy: "network-only",
  });

  const handleNext = async () => {
    try {
      setError(null);
      setUserAlreadyExists(false);
      const { name, email, username, password } = getValues();

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

      const { data, error: queryError } = await checkUsername({
        variables: {
          email,
          username,
        },
      });

      if (queryError) {
        setError("An error occurred while checking username availability.");
        console.error(queryError);
        return;
      }

      if (!data.checkUser.success) {
        setError("User already exists.");
        setUserAlreadyExists(true);
        return;
      } else {
        onNext();
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }
  };

  return (
    <OnboardingLayout>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        {/* Heading */}
        <Text style={styles.headerText}>Create Your Account</Text>

        {/* Error Handling */}
        {error && (
          <Alert className="mb-6" action="error">
            <AlertIcon as={AlertCircleIcon} />
            <AlertText className="px-4">
              <HStack>
                <UIText>{error}</UIText>
                {userAlreadyExists && (
                  <Link onPress={onLogin}>
                    <LinkText>Login</LinkText>
                  </Link>
                )}
              </HStack>
            </AlertText>
          </Alert>
        )}

        {/* Form */}
        <ScrollView 
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formContainer}>
            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>What is your name?</Text>
              <TextInput
                style={styles.input}
                value={nameInput.field.value}
                onChangeText={nameInput.field.onChange}
                placeholder="Enter your full name"
                placeholderTextColor="#bbb"
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>What is your email?</Text>
              <TextInput
                style={styles.input}
                value={emailInput.field.value}
                onChangeText={emailInput.field.onChange}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="Enter your email"
                placeholderTextColor="#bbb"
              />
            </View>

            {/* Username Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Pick your username</Text>
              <TextInput
                style={styles.input}
                value={usernameInput.field.value}
                onChangeText={usernameInput.field.onChange}
                autoCapitalize="none"
                placeholder="Pick a username"
                placeholderTextColor="#bbb"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Type your password</Text>
              <TextInput
                style={styles.input}
                value={passwordInput.field.value}
                onChangeText={passwordInput.field.onChange}
                secureTextEntry={true}
                autoCapitalize="none"
                placeholder="Enter your password"
                placeholderTextColor="#bbb"
              />
            </View>
          </View>
        </ScrollView>

        {/* Next Button */}
        <View style={styles.buttonContainer}>
          <Button
            action="secondary"
            onPress={handleNext}
            disabled={loading}
            style={styles.nextButton} 
          >
            {loading && <ButtonSpinner />}
            <ButtonText className="text-white">Next</ButtonText>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A", // Dark background for a modern look
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 20,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginVertical: 40,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 18,
    color: "#FFF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2C2C2C", // Slightly lighter background for inputs
    color: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#444",
    fontSize: 16,
  },
  buttonContainer: {
    marginVertical: 20,
  },
  nextButton: {
    paddingHorizontal: 40,
    backgroundColor: "#4F76A1", // Blue color for the button
    borderRadius: 8,
  },
});
