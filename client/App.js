import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import Home from './screens/Home';
import TabNavigator from './navigations/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <GluestackUIProvider mode="light">
      <NavigationContainer>
        <TabNavigator>
          <View style={styles.container}>
            <StatusBar style="auto" />
          </View>
        </TabNavigator>
      </NavigationContainer>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
