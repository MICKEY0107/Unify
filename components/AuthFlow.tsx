import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LoginScreen from '../app/login';
import { useAuth } from '../contexts/AuthContext';

interface AuthFlowProps {
  children: React.ReactNode;
}

export default function AuthFlow({ children }: AuthFlowProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // If user is not authenticated, show login screen
  if (!user) {
    return <LoginScreen />;
  }

  // If user is authenticated, show main app
  return <>{children}</>;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
});
