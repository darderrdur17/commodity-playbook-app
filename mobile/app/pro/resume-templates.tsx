import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  StyleSheet, ActivityIndicator, RefreshControl, Linking,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { API_URL, contentApi } from "../../lib/api";

const PRIMARY = "#3280ff";

export default function ResumeTemplatesScreen() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await contentApi.get<{ templates: any[]; assetUrls: Record<string, string> }>("resume-templates");
      setTemplates(data.templates);
      setAssetUrls(data.assetUrls || {});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function openTemplate(template: any) {
    const cmsUrl = assetUrls[template.templateFile];
    if (cmsUrl) {
      await WebBrowser.openBrowserAsync(`${API_URL}${cmsUrl}`);
      return;
    }
    const staticUrl = `${API_URL}/templates/${template.templateFile}`;
    const canOpen = await Linking.canOpenURL(staticUrl);
    if (canOpen) {
      await Linking.openURL(staticUrl);
    } else {
      Alert.alert("Download", "Open the web app to download this template.");
    }
  }

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 32 }}
    >
      {templates.map((t) => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.label}>{t.label}</Text>
          <Text style={styles.desc}>{t.positioningChallenge}</Text>
          <TouchableOpacity style={styles.btn} onPress={() => openTemplate(t)}>
            <Text style={styles.btnText}>Open / Download</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e4e7ec" },
  label: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  desc: { fontSize: 13, color: "#677184", lineHeight: 20, marginBottom: 12 },
  btn: { backgroundColor: PRIMARY, borderRadius: 8, padding: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
