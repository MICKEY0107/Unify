import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function SplashScreen2() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#FFF8F0", "#FFE5B4", "#FFB366", "#FF8C42"]}
        locations={[0, 0.3, 0.6, 0.8, 1]}
        style={styles.gradient}
      >
        {/* Multiple decorative elements */}
        <View style={styles.splash1} />
        <View style={styles.splash2} />
        <View style={styles.splash3} />
        <View style={styles.splash4} />
        
        {/* Unify text with logo */}
        <View style={styles.textContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/logo.svg")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.unifyText}>Unify</Text>
          <Text style={styles.tagline}>Bridging Worlds, Building Empathy</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: "relative",
  },
  splash1: {
    position: "absolute",
    top: height * 0.08,
    right: width * 0.08,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 179, 102, 0.25)",
    opacity: 0.7,
  },
  splash2: {
    position: "absolute",
    bottom: height * 0.15,
    left: width * 0.05,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 179, 102, 0.2)",
    opacity: 0.6,
  },
  splash3: {
    position: "absolute",
    top: height * 0.3,
    left: width * 0.1,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 140, 66, 0.15)",
    opacity: 0.5,
  },
  splash4: {
    position: "absolute",
    bottom: height * 0.35,
    right: width * 0.15,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 179, 102, 0.2)",
    opacity: 0.4,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.05,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
  },
  unifyText: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#FF6B35",
    textShadowColor: "rgba(255, 107, 53, 0.5)",
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 8,
    letterSpacing: 4,
    fontStyle: "italic",
    marginBottom: 10,
  },
  tagline: {
    fontSize: 16,
    color: "#FF8C42",
    fontWeight: "500",
    textAlign: "center",
    opacity: 0.9,
    letterSpacing: 1,
  },
});
