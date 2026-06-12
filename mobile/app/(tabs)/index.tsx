import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  RefreshControl, Dimensions, Alert
} from "react-native";
import { router } from "expo-router";
import { getToken, authApi } from "../../lib/api";

const { width } = Dimensions.get("window");
const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

interface UserData {
  name: string;
  email: string;
  tier: string;
  track: string;
  persona: string | null;
  mentorCredits: number;
}

const CONTENT_TILES = [
  { title: "Desk Glossary", desc: "100 essential terms", route: "/glossary", free: true, color: "#16a34a" },
  { title: "Full Playbook", desc: "5 chapters", route: "/playbook", tier: "PRO", color: PRIMARY },
  { title: "Career Roadmap", desc: "10 role blueprints", route: null, tier: "PRO", color: PRIMARY, webOnly: true },
  { title: "Desk Channel", desc: "40 practitioner Q&As", route: "/community/desk-channel", tier: "ELITE", color: "#B45309" },
  { title: "Mentor Connect", desc: "Ask practitioners", route: "/community/mentor-connect", tier: "ELITE", color: "#B45309" },
  { title: "Job Openings", desc: "Curated trading roles", route: "/community/job-openings", tier: "ELITE", color: "#B45309" },
];

export default function DashboardTab() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function loadUser() {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/(auth)/login");
        return;
      }
      const data = await authApi.me();
      setUser(data.user);
    } catch {
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!user) return null;

  const tierColor = user.tier === "ELITE" ? "#B45309" : user.tier === "PRO" ? PRIMARY : "#16a34a";

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header card */}
      <View style={styles.headerCard}>
        <View style={styles.headerInner}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{user.name?.[0]?.toUpperCase() || "U"}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user.name?.split(" ")[0] || "Trader"}</Text>
          </View>
          <View style={[styles.tierBadge, { borderColor: tierColor }]}>
            <Text style={[styles.tierText, { color: tierColor }]}>{user.tier}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          {[
            { label: "Track", value: user.track },
            { label: "Mentor Credits", value: String(user.mentorCredits) },
            { label: "Persona", value: user.persona?.replace("_", " ") || "Not set" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content tiles */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Content</Text>
        <View style={styles.tilesGrid}>
          {CONTENT_TILES.map((tile) => {
            const isLocked = tile.tier &&
              (tile.tier === "ELITE" ? user.tier !== "ELITE" : user.tier === "STARTER");

            return (
              <TouchableOpacity
                key={tile.title}
                style={[styles.tile, isLocked && styles.tileLocked]}
                onPress={() => {
                  if (isLocked) {
                    Alert.alert("Upgrade Required", `This content requires ${tile.tier} membership.`, [
                      { text: "Cancel", style: "cancel" },
                    ]);
                    return;
                  }
                  if (tile.route) {
                    router.push(tile.route as any);
                  } else if (tile.webOnly) {
                    Alert.alert("Web Only", "Open the website for Career Roadmap and other Pro tools.");
                  } else if (tile.free) {
                    router.push("/(tabs)/glossary");
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.tileDot, { backgroundColor: tile.color }]} />
                <Text style={styles.tileTitle}>{tile.title}</Text>
                <Text style={styles.tileDesc}>{tile.desc}</Text>
                {tile.free && (
                  <View style={styles.freeBadge}>
                    <Text style={styles.freeBadgeText}>Free</Text>
                  </View>
                )}
                {isLocked && (
                  <View style={[styles.tierBadgeSmall, { borderColor: tile.color }]}>
                    <Text style={[styles.tierBadgeSmallText, { color: tile.color }]}>
                      {tile.tier}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Upgrade CTA */}
      {user.tier !== "ELITE" && (
        <View style={styles.upgradeCta}>
          <Text style={styles.upgradeTitle}>
            {user.tier === "STARTER" ? "Unlock Pro — SGD 99" : "Upgrade to Elite — SGD 299/mo"}
          </Text>
          <Text style={styles.upgradeDesc}>
            {user.tier === "STARTER"
              ? "Get the full playbook, resume templates, and career roadmap."
              : "Unlock case studies, mentor connect, and desk channel."}
          </Text>
          <TouchableOpacity style={styles.upgradeBtn}>
            <Text style={styles.upgradeBtnText}>See Plans</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: "#677184", fontSize: 14 },
  headerCard: {
    backgroundColor: NAVY,
    padding: 24,
    paddingTop: 20,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  greeting: { color: "rgba(255,255,255,0.6)", fontSize: 12 },
  userName: { color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "serif" },
  tierBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1.5,
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  tierText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statItem: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    padding: 12,
  },
  statValue: { color: "#fff", fontSize: 13, fontWeight: "600", marginBottom: 2 },
  statLabel: { color: "rgba(255,255,255,0.45)", fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5 },
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 14,
    fontFamily: "serif",
  },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  tile: {
    width: (width - 50) / 2,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  tileLocked: { opacity: 0.7 },
  tileDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  tileTitle: { fontSize: 13, fontWeight: "700", color: "#1a1a1a", marginBottom: 3 },
  tileDesc: { fontSize: 11, color: "#677184" },
  freeBadge: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "#f0fdf4",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  freeBadgeText: { fontSize: 10, fontWeight: "700", color: "#16a34a" },
  tierBadgeSmall: {
    marginTop: 8,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  tierBadgeSmallText: { fontSize: 10, fontWeight: "700" },
  upgradeCta: {
    backgroundColor: NAVY,
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  upgradeTitle: { color: "#fff", fontSize: 16, fontWeight: "700", marginBottom: 6 },
  upgradeDesc: { color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 18, marginBottom: 14 },
  upgradeBtn: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  upgradeBtnText: { color: NAVY, fontWeight: "700", fontSize: 13 },
});
