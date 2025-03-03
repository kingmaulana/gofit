import {StatusBar} from 'expo-status-bar';
import '@/global.css';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import {StyleSheet, View} from 'react-native';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingNavigations from '@/navigations/onboarding/onboarding-navigations';
import {useEffect, useState} from "react";
import * as NavigationBar from "expo-navigation-bar";
import {ApolloProvider} from "@apollo/client";
import client from "@/config/apollo";
import {getSecure} from "@/helpers/secure";

export default function App() {
  const [onboarding, setOnboarding] = useState(true);

  useEffect(() => {
    const getToken = async () => {
      const token = await getSecure("token");
      if (token) {
        setOnboarding(false);
      }
    }
    getToken().then(async () => {
      if (!onboarding) {
        await NavigationBar.setBackgroundColorAsync("white");
      }
    });
  }, [onboarding]);

  if (onboarding) {
    return (
      <ApolloProvider client={client}>
        <GluestackUIProvider mode="light">
          <NavigationContainer>
            <OnboardingNavigations/>
          </NavigationContainer>
        </GluestackUIProvider>
      </ApolloProvider>
    );
  }

  return (
    <ApolloProvider client={client}>
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <TabNavigator/>
          <View style={styles.container}>
            <StatusBar style="auto"/>
          </View>
        </NavigationContainer>
      </GluestackUIProvider>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});