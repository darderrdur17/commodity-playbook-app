import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { contentApi } from "../../lib/api";

const PRIMARY = "#3280ff";

export default function CareerRoadmapScreen() {
  const [roles, setRoles] = useState<any[]>([]);
  const [active, setActive] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await contentApi.get<{ roles: any[] }>("career-roadmap");
      setRoles(data.roles);
      if (!active && data.roles[0]) setActive(data.roles[0].slug);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const role = roles.find((r) => r.slug === active) || roles[0];

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      contentContainerStyle={{ paddingBottom: 32 }}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
        {roles.map((r) => (
          <TouchableOpacity key={r.slug} onPress={() => setActive(r.slug)} style={[styles.tab, active === r.slug && styles.tabActive]}>
            <Text style={[styles.tabText, active === r.slug && styles.tabTextActive]}>{r.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {role && (
        <View style={styles.detail}>
          <Text style={styles.title}>{role.title}</Text>
          <Text style={styles.comp}>{role.comp}</Text>
          <Text style={styles.body}>{role.summary}</Text>
          {(role.upgradePath || []).map((step: string, i: number) => (
            <Text key={i} style={styles.step}>• {step}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  tabs: { padding: 12, gap: 8 },
  tab: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff", borderWidth: 1, borderColor: "#e4e7ec" },
  tabActive: { backgroundColor: PRIMARY, borderColor: PRIMARY },
  tabText: { fontSize: 12, fontWeight: "600", color: "#677184" },
  tabTextActive: { color: "#fff" },
  detail: { margin: 12, backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e4e7ec" },
  title: { fontSize: 18, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  comp: { fontSize: 13, color: PRIMARY, fontWeight: "600", marginBottom: 12 },
  body: { fontSize: 14, color: "#374151", lineHeight: 22, marginBottom: 12 },
  step: { fontSize: 13, color: "#677184", lineHeight: 20, marginBottom: 4 },
});
