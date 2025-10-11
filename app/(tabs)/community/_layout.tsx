import { Stack } from "expo-router";
import { colors } from "../../../constants/theme";

export default function CommunityStack() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
          color: colors.textPrimary,
        },
        headerTintColor: colors.primary,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Community Stories",
          headerShown: false,
        }} 
      />
      <Stack.Screen 
        name="post" 
        options={{ 
          title: "Share Your Story",
          presentation: "modal",
        }} 
      />
      <Stack.Screen 
        name="read/[id]" 
        options={{ 
          title: "Story",
          presentation: "modal",
          headerShown: true,
        }} 
      />
    </Stack>
  );
}
