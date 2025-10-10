export const colors = {
  primary: "#007AFF",
  primaryLight: "#E3F2FD",
  secondary: "#8E8E93",
  success: "#4CAF50",
  warning: "#FF9800",
  error: "#F44336",
  info: "#2196F3",
  
  // Background colors
  background: "#F8F9FA",
  surface: "#FFFFFF",
  surfaceSecondary: "#F5F5F5",
  
  // Text colors
  textPrimary: "#1A1A1A",
  textSecondary: "#666666",
  textTertiary: "#8E8E93",
  textInverse: "#FFFFFF",
  
  // Border colors
  border: "#E5E5EA",
  borderLight: "#F0F0F0",
  
  // Status colors
  verified: "#4CAF50",
  pending: "#FF9800",
  
  // Category colors
  signLanguage: "#4ECDC4",
  communication: "#45B7D1",
  awareness: "#FF6B6B",
  mobility: "#96CEB4",
  visual: "#9C27B0",
  hearing: "#FF9800",
  cognitive: "#607D8B",
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const typography = {
  h1: {
    fontSize: 28,
    fontWeight: "bold" as const,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: "bold" as const,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: "600" as const,
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: "600" as const,
    lineHeight: 24,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "400" as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: "400" as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: "500" as const,
  },
  buttonSmall: {
    fontSize: 14,
    fontWeight: "500" as const,
  },
};

export const shadows = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    // Web compatibility
    boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.05)",
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    // Web compatibility
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  large: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    // Web compatibility
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  },
};
