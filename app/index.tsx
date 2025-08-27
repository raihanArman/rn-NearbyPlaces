import React from "react";
import { createNavigationContainerRef, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MapsScreen from "./screens/MapsScreen";
import { enableScreens } from "react-native-screens";
import { MapsProvider } from "./hooks/mapsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type RootStackParamList = {
  Splash: undefined;
  Maps: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const rootNavigationRef = createNavigationContainerRef<RootStackParamList>();
enableScreens();

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer ref={rootNavigationRef}>
        <MapsProvider>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {/* <Stack.Screen name="Splash" component={SplashScreen} /> */}
            <Stack.Screen name="Maps" component={MapsScreen} />
          </Stack.Navigator>
        </MapsProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}