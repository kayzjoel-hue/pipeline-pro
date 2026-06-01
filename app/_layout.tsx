import "@/global.css";
import "react-native-reanimated";

import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { OnboardingProvider } from "@/lib/onboarding-context";
import { ThemeProvider } from "@/lib/theme-provider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics ?? undefined}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <OnboardingProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="onboarding" />
              <Stack.Screen name="login" options={{ presentation: "fullScreenModal" }} />
              <Stack.Screen name="privacy" />
            </Stack>
            <StatusBar style="auto" />
          </OnboardingProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
