import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
} from "react-native";
import { authApi, communityApi, getToken } from "../../lib/api";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

export default function WaitlistScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [track, setTrack] = useState<"CAREER" | "SALES">("CAREER");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [prefillLoading, setPrefillLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await authApi.me();
          setName(data.user.name || "");
          setEmail(data.user.email || "");
        }
      } catch {
        // allow manual entry
      } finally {
        setPrefillLoading(false);
      }
    })();
  }, []);

  async function submit() {
    if (!email.trim()) {
      Alert.alert("Required", "Please enter your email.");
      return;
    }
    setLoading(true);
    try {
      await communityApi.joinWaitlist({ email: email.trim(), name: name.trim(), track, gdprOpt: true });
      setSuccess(true);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  }

  if (prefillLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PRIMARY} />
      </View>
    );
  }

  if (success) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.successTitle}>You&apos;re on the list!</Text>
        <Text style={styles.successDesc}>
          We&apos;ll notify you at {email} when the job board launches.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Job Board Waitlist</Text>
        <Text style={styles.heroDesc}>
          Be first to access curated commodity trading roles when we launch.
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your name" />
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Track</Text>
        <View style={styles.trackRow}>
          {(["CAREER", "SALES"] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.trackBtn, track === t && styles.trackBtnActive]}
              onPress={() => setTrack(t)}
            >
              <Text style={[styles.trackText, track === t && styles.trackTextActive]}>
                {t === "CAREER" ? "Build a Career" : "Sell Into Firms"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.gdpr}>
          By joining, you agree to receive one launch notification. GDPR-compliant — we never sell your email.
        </Text>
        <TouchableOpacity style={styles.submitBtn} onPress={submit} disabled={loading}>
          <Text style={styles.submitText}>{loading ? "Joining..." : "Join Waitlist"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { alignItems: "center", justifyContent: "center", padding: 24 },
  hero: { backgroundColor: NAVY, borderRadius: 14, padding: 20, marginBottom: 16 },
  heroTitle: { color: "#fff", fontSize: 20, fontWeight: "700", marginBottom: 8 },
  heroDesc: { color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 20 },
  form: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e4e7ec" },
  label: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 6, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#e4e7ec",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  trackRow: { flexDirection: "row", gap: 8 },
  trackBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    alignItems: "center",
  },
  trackBtnActive: { borderColor: PRIMARY, backgroundColor: "#f0f7ff" },
  trackText: { fontSize: 12, color: "#677184", fontWeight: "600" },
  trackTextActive: { color: PRIMARY },
  gdpr: { fontSize: 11, color: "#677184", marginTop: 14, lineHeight: 16 },
  submitBtn: {
    marginTop: 16,
    backgroundColor: PRIMARY,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  successTitle: { fontSize: 22, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  successDesc: { fontSize: 14, color: "#677184", textAlign: "center", lineHeight: 20 },
});
