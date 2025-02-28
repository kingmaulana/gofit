import {StatusBar} from 'expo-status-bar';
import '@/global.css';
import {GluestackUIProvider} from '@/components/ui/gluestack-ui-provider';
import {StyleSheet, View} from 'react-native';
import TabNavigator from './navigations/TabNavigator';
import {NavigationContainer} from '@react-navigation/native';
import OnboardingNavigations from '@/navigations/onboarding/onboarding-navigations';

export default function App() {
  const onboarding = true;

  if (onboarding) {
    return (
      <GluestackUIProvider mode="light">
        <NavigationContainer>
          <OnboardingNavigations/>
        </NavigationContainer>
      </GluestackUIProvider>
    );
  }

  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <TabNavigator/>
        <View style={styles.container}>
          <StatusBar style="auto"/>
        </View>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});