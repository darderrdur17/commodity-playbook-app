import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: "Sign In", headerShown: false }} />
        <Stack.Screen name="(auth)/signup" options={{ title: "Create Account", headerShown: false }} />
        <Stack.Screen name="community/desk-channel" options={{ title: "Desk Channel", headerStyle: { backgroundColor: "#0830a0" }, headerTintColor: "#fff" }} />
        <Stack.Screen name="community/mentor-connect" options={{ title: "Mentor Connect", headerStyle: { backgroundColor: "#0830a0" }, headerTintColor: "#fff" }} />
        <Stack.Screen name="community/job-openings" options={{ title: "Job Openings", headerStyle: { backgroundColor: "#0830a0" }, headerTintColor: "#fff" }} />
        <Stack.Screen name="community/waitlist" options={{ title: "Job Board Waitlist", headerStyle: { backgroundColor: "#0830a0" }, headerTintColor: "#fff" }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
