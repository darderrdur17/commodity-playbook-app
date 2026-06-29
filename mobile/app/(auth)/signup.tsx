import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, ScrollView
} from "react-native";
import { router } from "expo-router";
import { authApi, setToken } from "../../lib/api";
import { Logo } from "../../components/Logo";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [gdpr, setGdpr] = useState(false);

  async function handleSignup() {
    if (!name || !email || !password) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (!gdpr) {
      Alert.alert("Privacy Policy", "Please accept the privacy policy to continue.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      const data = await authApi.register(name, email, password);
      await setToken(data.token);
      router.replace("/(tabs)");
    } catch (e: any) {
      Alert.alert("Sign Up Failed", e.message || "Something went wrong.");
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
          <Logo variant="white" />
          <Text style={styles.headerSub}>Free to start. No credit card needed.</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Already have one?{" "}
            <Text style={styles.link} onPress={() => router.push("/(auth)/login")}>
              Sign in
            </Text>
          </Text>

          {[
            { label: "Full name", value: name, setter: setName, placeholder: "Alex Chen", type: "default" },
            { label: "Email", value: email, setter: setEmail, placeholder: "you@example.com", type: "email-address" as const },
            { label: "Password", value: password, setter: setPassword, placeholder: "Min. 8 characters", type: "default", secure: true },
          ].map((field) => (
            <View key={field.label} style={styles.field}>
              <Text style={styles.label}>{field.label}</Text>
              <TextInput
                style={styles.input}
                placeholder={field.placeholder}
                placeholderTextColor="#9ca3af"
                value={field.value}
                onChangeText={field.setter}
                keyboardType={field.type as any}
                autoCapitalize={field.type === "email-address" || field.secure ? "none" : "words"}
                secureTextEntry={field.secure}
                autoCorrect={false}
              />
            </View>
          ))}

          {/* GDPR */}
          <TouchableOpacity
            style={styles.gdprRow}
            onPress={() => setGdpr(!gdpr)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, gdpr && styles.checkboxActive]}>
              {gdpr && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.gdprText}>
              I agree to the Privacy Policy and Terms. I may receive the Weekly Market Digest.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnLoading]}
            onPress={handleSignup}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.btnText}>
              {loading ? "Creating account..." : "Create Account — Free"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { backgroundColor: NAVY, padding: 40, paddingTop: 60, alignItems: "center" },
  logoMark: {
    width: 20, height: 20, backgroundColor: PRIMARY,
    transform: [{ rotate: "45deg" }], marginBottom: 10,
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
    borderWidth: 1, borderColor: "#e4e7ec", borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: "#1a1a1a", backgroundColor: "#fff",
  },
  gdprRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 20 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#e4e7ec",
    alignItems: "center", justifyContent: "center", marginTop: 2,
  },
  checkboxActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  checkmark: { color: "#fff", fontSize: 12, fontWeight: "700" },
  gdprText: { flex: 1, fontSize: 12, color: "#677184", lineHeight: 18 },
  btn: {
    backgroundColor: PRIMARY, borderRadius: 12,
    paddingVertical: 14, alignItems: "center", marginTop: 4,
  },
  btnLoading: { opacity: 0.7 },
  btnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
