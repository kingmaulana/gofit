import React from 'react';
import { ImageBackground, View } from 'react-native';
import { Button, ButtonText } from "@/components/ui/button";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OnboardingLayout from "@/components/screens/onboarding-layout";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen({ onRegisterClick }) {
  const navigation = useNavigation();

  const imageWall = {uri: "https://i0.wp.com/www.pictureperfectphoto.co.uk/wp-content/uploads/2023/03/199-J412-scaled.jpg?resize=683%2C1024&ssl=1"}

  return (
    <OnboardingLayout>
      {/* Background Image */}
      <ImageBackground
        source={imageWall}
        className="flex-1 relative"
      >
        {/* Dark overlay */}
        <View className="absolute inset-0 bg-black/50" />
        
        <View className="flex-1 justify-center items-center px-5 pt-15">
          {/* Logo/Icon */}
          <View className="w-30 h-30 rounded-full bg-white/10 justify-center items-center mb-8 shadow-lg">
            <MaterialCommunityIcons name="dumbbell" size={60} color="white" />
          </View>

          <Text className="text-4xl text-white/80 text-center mb-8 font-medium max-w-[90%] shadow-text">
          Welcome to GoFit
          </Text>

          {/* Button */} 
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="w-full rounded-2xl my-5 shadow-lg shadow-indigo-500/30"
          >
            <Button
              onPress={onRegisterClick}
              size="xl"
              className="bg-transparent w-full"
            >
              <ButtonText className="text-white text-lg font-bold">Let's get started</ButtonText>
            </Button>
          </LinearGradient>

          {/* Login Link */}
          <HStack className="items-center mt-4">
            <Text className="text-white/90 text-base">Already have an account? </Text>
            <Link onPress={() => navigation.navigate('Login')}>
              <LinkText className="text-indigo-500 text-base font-bold">Login</LinkText>
            </Link>
          </HStack>
        </View>
      </ImageBackground>
    </OnboardingLayout>
  );
}

