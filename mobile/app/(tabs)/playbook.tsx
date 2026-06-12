import React, { useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  FlatList, Alert
} from "react-native";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

const CHAPTERS = [
  {
    id: "a", letter: "A", title: "Industry Architecture",
    subtitle: "How the commodity market actually works",
    color: "#0830a0", pages: 42, preview: true,
  },
  {
    id: "b", letter: "B", title: "Desk Operations",
    subtitle: "The mechanics of a trading desk",
    color: "#0131cc", pages: 38, preview: false,
  },
  {
    id: "c", letter: "C", title: "Market Intelligence",
    subtitle: "Reading and anticipating commodity markets",
    color: "#0040f5", pages: 44, preview: false,
  },
  {
    id: "d", letter: "D", title: "Commercial Skills",
    subtitle: "Negotiation, deal-making and counterparty relationships",
    color: "#115cff", pages: 36, preview: false,
  },
  {
    id: "e", letter: "E", title: "Career Mastery",
    subtitle: "Positioning yourself for the long career",
    color: "#3280ff", pages: 40, preview: false,
  },
];

export default function PlaybookTab() {
  const [userTier] = useState("STARTER"); // Replace with actual session

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>The Full Playbook</Text>
        <Text style={styles.headerSub}>5 chapters · 200+ pages</Text>
      </View>

      <FlatList
        data={CHAPTERS}
        keyExtractor={(c) => c.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        renderItem={({ item: chapter }) => {
          const isUnlocked = userTier !== "STARTER" || chapter.preview;
          return (
            <TouchableOpacity
              style={[styles.chapterCard, !isUnlocked && styles.chapterLocked]}
              onPress={() => {
                if (!isUnlocked) {
                  Alert.alert("Pro Required", "Upgrade to Pro to access this chapter.");
                }
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.chapterLetter, { backgroundColor: chapter.color }]}>
                <Text style={styles.chapterLetterText}>{chapter.letter}</Text>
              </View>
              <View style={styles.chapterInfo}>
                <View style={styles.chapterTitleRow}>
                  <Text style={styles.chapterTitle}>{chapter.title}</Text>
                  {chapter.preview && (
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>Preview</Text>
                    </View>
                  )}
                  {!isUnlocked && (
                    <View style={styles.lockBadge}>
                      <Text style={styles.lockBadgeText}>🔒 Pro</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.chapterSub}>{chapter.subtitle}</Text>
                <Text style={styles.chapterMeta}>{chapter.pages} pages</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: {
    backgroundColor: NAVY,
    padding: 20,
    paddingTop: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "serif",
    marginBottom: 4,
  },
  headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 13 },
  chapterCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  chapterLocked: { opacity: 0.65 },
  chapterLetter: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  chapterLetterText: { color: "#fff", fontSize: 20, fontWeight: "bold", fontFamily: "serif" },
  chapterInfo: { flex: 1 },
  chapterTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  chapterTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  chapterSub: { fontSize: 12, color: "#677184", marginTop: 2 },
  chapterMeta: { fontSize: 11, color: "#9ca3af", marginTop: 3 },
  previewBadge: {
    backgroundColor: "#f0fdf4",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  previewBadgeText: { fontSize: 9, fontWeight: "700", color: "#16a34a" },
  lockBadge: {
    backgroundColor: "#eff6ff",
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  lockBadgeText: { fontSize: 9, fontWeight: "700", color: PRIMARY },
});
