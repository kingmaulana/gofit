import {useContext, useEffect} from "react";
import {AuthContext} from "@/helpers/auth-context";
import {getSecure} from "@/helpers/secure";
import * as NavigationBar from "expo-navigation-bar";
import {NavigationContainer} from "@react-navigation/native";
import TabNavigator from "@/navigations/TabNavigator";
import {StyleSheet, View} from "react-native";
import {StatusBar} from "expo-status-bar";
import OnboardingNavigations from "@/navigations/onboarding/onboarding-navigations";
import {GluestackUIProvider} from "@/components/ui/gluestack-ui-provider";
import Home from "./screens/Home";
import RootStackHome from "./navigations/RootStackHome";

export default function AppConsumer() {
  const {login, loading} = useContext(AuthContext);

  if (loading) {
    return <View>
      <StatusBar style="auto"/>
    </View>
  }

  return <GluestackUIProvider mode="light">
    <NavigationContainer>
      {login ? <>
        <TabNavigator>
          <RootStackHome />
        </TabNavigator>
        {/* <View style={styles.container}>
          <StatusBar style="auto"/>
        </View> */}
      </> : <OnboardingNavigations/>}
    </NavigationContainer>
  </GluestackUIProvider>
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});