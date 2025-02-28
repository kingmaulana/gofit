import React from 'react';
import OnboardingFlow from '@/navigations/onboarding/onboarding-flow';
import {createStackNavigator} from "@react-navigation/stack";

const Stack = createStackNavigator();

const OnboardingNavigations = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={OnboardingFlow} options={{
        headerShown: false
      }}/>
    </Stack.Navigator>
  );
};

export default OnboardingNavigations;