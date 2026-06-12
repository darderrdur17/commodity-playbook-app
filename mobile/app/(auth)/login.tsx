import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView
} from "react-native";
import { router } from "expo-router";
import { authApi, setToken } from "../../lib/api";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      await setToken(data.token);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign In Failed", e.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMark} />
          <Text style={styles.logoText}>
            Commodity<Text style={{ color: "#dff2ff" }}>Playbook</Text>
          </Text>
          <Text style={styles.headerSub}>Welcome back to the desk.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Don't have an account?{" "}
            <Text
              style={styles.link}
              onPress={() => router.push("/(auth)/signup")}
            >
              Create one free
            </Text>
          </Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#9ca3af"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1, borderRightWidth: 0 }]}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeBtn}
              >
                <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnLoading]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign In"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: NAVY,
    padding: 40,
    paddingTop: 60,
    alignItems: "center",
  },
  logoMark: {
    width: 20,
    height: 20,
    backgroundColor: PRIMARY,
    transform: [{ rotate: "45deg" }],
    marginBottom: 10,
  },
  logoText: { color: "#fff", fontSize: 20, fontWeight: "700", fontFamily: "serif", marginBottom: 6 },
  headerSub: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  form: { padding: 24 },
  title: { fontSize: 26, fontWeight: "700", color: "#1a1a1a", fontFamily: "serif", marginBottom: 6 },
  subtitle: { fontSize: 13, color: "#677184", marginBottom: 24 },
  link: { color: PRIMARY, fontWeight: "600" },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1a1a1a",
    backgroundColor: "#fff",
  },
  passwordContainer: { flexDirection: "row", alignItems: "center" },
  eyeBtn: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderLeftWidth: 0,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  eyeText: { fontSize: 16 },
  btn: {
    backgroundColor: PRIMARY,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnLoading: { opacity: 0.7 },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
