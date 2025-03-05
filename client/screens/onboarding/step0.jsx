import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import OnboardingLayout from "@/components/screens/onboarding-layout";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen({ onRegisterClick }) {
  const navigation = useNavigation();

  const imageWall = {uri: "https://i0.wp.com/www.pictureperfectphoto.co.uk/wp-content/uploads/2023/03/199-J412-scaled.jpg?resize=683%2C1024&ssl=1"}

  return (
    <OnboardingLayout>
      {/* Background Image */}
      <ImageBackground
        source={imageWall}  // Add your background image path here
        style={styles.background}
      >
        <View className="flex-1 flex-col justify-center items-center">
          {/* Heading */}
          <Text className="text-white text-6xl text-center font-black shadow-slate-800 shadow-lg" style={{ marginVertical: 32 }}>
            Welcome to GoFit
          </Text>

          {/* Button */}
          <Button className='bg-black shadow-black shadolg' action="secondary" onPress={onRegisterClick} size="xl" style={{ marginVertical: 16 }}>
            <ButtonText className='text-white'>Let's get started</ButtonText>
          </Button>

          {/* Login Link */}
          <HStack>
            <Text className="text-white">Already have an account? </Text>
            <Link onPress={() => navigation.navigate('Login')}>
              <LinkText>Login</LinkText>
            </Link>
          </HStack>
        </View>
      </ImageBackground>
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',  // Ensures the image covers the whole screen
  },
});
