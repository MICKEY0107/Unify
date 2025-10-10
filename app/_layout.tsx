import { Stack } from "expo-router";
import ErrorBoundary from "../components/ErrorBoundary";
import { colors } from "../constants/theme";
import { AuthProvider } from "../contexts/AuthContext";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
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
            name="splash1"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="splash2"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="onboarding"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
