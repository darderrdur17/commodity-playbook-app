import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { caseStudiesApi } from "../../lib/api";

const NAVY = "#0830a0";
const ELITE = "#B45309";
const PRIMARY = "#3280ff";

type Study = {
  slug: string;
  category: string;
  title: string;
  catchLine: string;
  description: string;
  readMinutes: number;
  hasFullContent: boolean;
};

export default function CaseStudiesScreen() {
  const [studies, setStudies] = useState<Study[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const data = await caseStudiesApi.list();
      setStudies(data.studies);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={ELITE} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
    >
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Case Studies</Text>
        <Text style={styles.heroDesc}>10 real-world scenarios with full P&L breakdowns</Text>
      </View>
      {studies.map((study) => (
        <TouchableOpacity
          key={study.slug}
          style={styles.card}
          activeOpacity={0.8}
          onPress={() => router.push(`/community/case-study/${study.slug}` as any)}
        >
          <View style={styles.cardTop}>
            <Text style={styles.category}>{study.category}</Text>
            {study.hasFullContent && (
              <View style={styles.fullBadge}>
                <Text style={styles.fullBadgeText}>Full</Text>
              </View>
            )}
          </View>
          <Text style={styles.title}>{study.title}</Text>
          <Text style={styles.catch} numberOfLines={2}>{study.catchLine}</Text>
          <Text style={styles.desc} numberOfLines={3}>{study.description}</Text>
          <Text style={styles.meta}>{study.readMinutes} min read</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { color: "#dc2626", textAlign: "center" },
  list: { paddingBottom: 32 },
  hero: {
    backgroundColor: NAVY,
    padding: 20,
    marginBottom: 12,
  },
  heroTitle: { color: "#fff", fontSize: 22, fontWeight: "700", marginBottom: 4 },
  heroDesc: { color: "rgba(255,255,255,0.65)", fontSize: 13 },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  category: { fontSize: 10, fontWeight: "700", color: ELITE, textTransform: "uppercase", letterSpacing: 0.5 },
  fullBadge: { backgroundColor: "#f0fdf4", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 },
  fullBadgeText: { fontSize: 9, fontWeight: "700", color: "#16a34a" },
  title: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  catch: { fontSize: 12, fontStyle: "italic", color: PRIMARY, marginBottom: 6 },
  desc: { fontSize: 13, color: "#677184", lineHeight: 18, marginBottom: 8 },
  meta: { fontSize: 11, color: "#9ca3af" },
});
