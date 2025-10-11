export const colors = {
  primary: "#D4A574", // Warm golden brown
  primaryLight: "#F5E6D3", // Light cream
  secondary: "#8B7355", // Muted brown
  success: "#6B8E23", // Olive green
  warning: "#D2691E", // Warm orange
  error: "#CD5C5C", // Muted red
  info: "#4682B4", // Steel blue
  
  // Background colors
  background: "#FEFBEA", // Cream background
  surface: "#FFFFFF", // Pure white for cards
  surfaceSecondary: "#F8F4E6", // Light cream
  
  // Text colors
  textPrimary: "#2C2C2C", // Dark brown
  textSecondary: "#6B5B47", // Medium brown
  textTertiary: "#8B7355", // Muted brown
  textInverse: "#FFFFFF",
  
  // Border colors
  border: "#E8DCC0", // Light cream border
  borderLight: "#F0E6D2", // Very light cream
  
  // Status colors
  verified: "#6B8E23", // Olive green
  pending: "#D2691E", // Warm orange
  
  // Category colors - warm palette
  signLanguage: "#8FBC8F", // Sage green
  communication: "#87CEEB", // Sky blue
  awareness: "#F4A460", // Sandy brown
  mobility: "#DDA0DD", // Plum
  visual: "#DEB887", // Burlywood
  hearing: "#F0E68C", // Khaki
  cognitive: "#B0C4DE", // Light steel blue
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
