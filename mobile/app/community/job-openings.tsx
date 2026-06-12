import React, { useEffect, useState, useMemo } from "react";
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity,
} from "react-native";
import { communityApi } from "../../lib/api";

const PRIMARY = "#3280ff";

export default function JobOpeningsScreen() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filters, setFilters] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [region, setRegion] = useState("All");
  const [level, setLevel] = useState("All");

  useEffect(() => {
    communityApi.getJobOpenings()
      .then((data) => {
        setJobs(data.jobs);
        setFilters(data.filters);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (region !== "All" && j.region !== region) return false;
      if (level !== "All" && j.level !== level) return false;
      return true;
    });
  }, [jobs, region, level]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PRIMARY} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.filters}>
        <Text style={styles.filterLabel}>Region</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(filters?.regions || ["All"]).map((r: string) => (
            <FilterPill key={r} label={r} active={region === r} onPress={() => setRegion(r)} />
          ))}
        </ScrollView>
        <Text style={[styles.filterLabel, { marginTop: 10 }]}>Level</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(filters?.levels || ["All"]).map((l: string) => (
            <FilterPill key={l} label={l} active={level === l} onPress={() => setLevel(l)} />
          ))}
        </ScrollView>
      </View>

      <Text style={styles.count}>{filtered.length} roles</Text>

      {filtered.map((job) => (
        <View key={job.id} style={[styles.card, job.featured && styles.featured]}>
          {job.featured && <Text style={styles.featuredBadge}>Featured</Text>}
          <Text style={styles.title}>{job.title}</Text>
          <Text style={styles.company}>{job.company} · {job.location}</Text>
          <Text style={styles.meta}>{job.level} · {job.segment} · {job.type}</Text>
          <Text style={styles.desc}>{job.description}</Text>
          {job.salary && <Text style={styles.salary}>{job.salary}</Text>}
        </View>
      ))}
      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function FilterPill({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  error: { color: "#dc2626", textAlign: "center" },
  filters: { padding: 12, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#e4e7ec" },
  filterLabel: { fontSize: 11, fontWeight: "700", color: "#677184", marginBottom: 6, textTransform: "uppercase" },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    marginRight: 8,
    backgroundColor: "#fff",
  },
  pillActive: { backgroundColor: "#f0f7ff", borderColor: PRIMARY },
  pillText: { fontSize: 12, color: "#677184" },
  pillTextActive: { color: PRIMARY, fontWeight: "600" },
  count: { padding: 12, fontSize: 13, color: "#677184" },
  card: {
    marginHorizontal: 12,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  featured: { borderColor: PRIMARY },
  featuredBadge: { fontSize: 10, fontWeight: "700", color: PRIMARY, marginBottom: 6 },
  title: { fontSize: 15, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  company: { fontSize: 13, color: "#374151", marginBottom: 2 },
  meta: { fontSize: 11, color: "#677184", marginBottom: 8 },
  desc: { fontSize: 13, color: "#374151", lineHeight: 19 },
  salary: { marginTop: 8, fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
});
