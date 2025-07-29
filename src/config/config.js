// Configuration for API endpoints and environment variables
const config = {
  // API Configuration
  API_BASE_URL:
    import.meta.env.API_BASE_URL || "https://192.168.196.1:5443/api/v1",

  // File upload configuration
  UPLOAD_BASE_URL:
    import.meta.env.UPLOAD_BASE_URL || "http://192.168.196.1:5000/uploads",

  // Authentication
  TOKEN_KEY: "authToken",
  ROLE_KEY: "role",
  USER_ID_KEY: "userId",

  // App Configuration
  APP_NAME: "PawConnect",

  // Email configuration (for password reset)
  EMAIL_FROM: "subekshyakayastha4@gmail.com",

  // Color Theme Configuration
  COLORS: {
    // Primary Colors
    PRIMARY: "#6366F1", // Indigo
    PRIMARY_DARK: "#4F46E5", // Darker indigo
    PRIMARY_LIGHT: "#A5B4FC", // Light indigo

    // Secondary Colors
    SECONDARY: "#10B981", // Emerald green
    SECONDARY_DARK: "#059669", // Darker emerald
    SECONDARY_LIGHT: "#6EE7B7", // Light emerald

    // Accent Colors
    ACCENT: "#F59E0B", // Amber
    ACCENT_DARK: "#D97706", // Darker amber
    ACCENT_LIGHT: "#FCD34D", // Light amber

    // Background Colors
    BACKGROUND_PRIMARY: "#F8FAFC", // Slate 50
    BACKGROUND_SECONDARY: "#F1F5F9", // Slate 100
    BACKGROUND_ACCENT: "#E0E7FF", // Indigo 100

    // Text Colors
    TEXT_PRIMARY: "#1E293B", // Slate 800
    TEXT_SECONDARY: "#64748B", // Slate 500
    TEXT_LIGHT: "#94A3B8", // Slate 400

    // Status Colors
    SUCCESS: "#10B981", // Emerald
    WARNING: "#F59E0B", // Amber
    ERROR: "#EF4444", // Red
    INFO: "#3B82F6", // Blue

    // Border Colors
    BORDER: "#E2E8F0", // Slate 200
    BORDER_FOCUS: "#6366F1", // Indigo
  },
};

export default config;
