import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView, ActivityIndicator, RefreshControl,
} from "react-native";
import { glossaryApi, authApi } from "../../lib/api";
import { BrandSearchPrefix } from "../../components/Logo";
import { PERSONA_GLOSSARY_GUIDES, PERSONA_LABELS } from "../../lib/glossary-persona";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

type GlossaryTerm = {
  term: string;
  definition: string;
  context?: string;
  category: string;
};

const CATEGORY_ORDER = [
  "Physical markets",
  "Pricing & Derivatives",
  "Risk & P&L",
  "Operations & Scheduling",
  "Shipping",
  "Gas & LNG",
  "Oil & Products",
  "Metals & Mining",
  "Market Intelligence & Analytics",
];

const CATEGORY_BADGES: Record<string, string> = {
  "Physical markets": "Physical",
  "Pricing & Derivatives": "Pricing",
  "Risk & P&L": "Risk",
  "Operations & Scheduling": "Ops",
  "Shipping": "Shipping",
  "Gas & LNG": "Gas & LNG",
  "Oil & Products": "Oil",
  "Metals & Mining": "Metals",
  "Market Intelligence & Analytics": "Intel",
};

const CATEGORY_COLORS: Record<string, string> = {
  "Physical markets": PRIMARY,
  "Pricing & Derivatives": "#0040f5",
  "Risk & P&L": "#B45309",
  "Operations & Scheduling": "#0F766E",
  "Shipping": "#115cff",
  "Gas & LNG": "#0131cc",
  "Oil & Products": NAVY,
  "Metals & Mining": "#5B21B6",
  "Market Intelligence & Analytics": "#9A3412",
};

export default function GlossaryTab() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [persona, setPersona] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const [data, personaRes] = await Promise.all([
        glossaryApi.getAll(),
        authApi.getPersona().catch(() => ({ persona: null })),
      ]);
      setTerms(data.terms);
      setPersona(personaRes.persona ?? null);
      setError("");
    } catch (e: any) {
      setError(e.message || "Failed to load glossary");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const categories = useMemo(() => {
    const present = new Set(terms.map((t) => t.category));
    const ordered = CATEGORY_ORDER.filter((c) => present.has(c));
    return ["All", ...ordered];
  }, [terms]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return terms.filter((t) => {
      const matchSearch =
        !q ||
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q) ||
        (t.context?.toLowerCase().includes(q) ?? false);
      const matchCat = activeCategory === "All" || t.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory, terms]);

  const groupedSections = useMemo(() => {
    const order =
      activeCategory === "All"
        ? CATEGORY_ORDER
        : [activeCategory];
    return order
      .map((category) => ({
        category,
        items: filtered.filter((t) => t.category === category),
      }))
      .filter((g) => g.items.length > 0);
  }, [filtered, activeCategory]);

  const personaGuide = persona ? PERSONA_GLOSSARY_GUIDES[persona] : null;
  const personaLabel = persona ? PERSONA_LABELS[persona] : null;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={PRIMARY} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Desk Glossary</Text>
        <Text style={styles.headerSub}>
          {terms.length} terms · 9 categories · Trader explanations
        </Text>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {personaGuide && personaLabel ? (
        <View style={styles.personaBanner}>
          <Text style={styles.personaBannerLabel}>Recommended for {personaLabel}</Text>
          <Text style={styles.personaBannerHeadline}>{personaGuide.headline}</Text>
          <Text style={styles.personaBannerTip}>{personaGuide.tip}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.personaPills}>
            {personaGuide.priorityCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => setActiveCategory(cat)}
                style={[styles.personaPill, activeCategory === cat && styles.personaPillActive]}
              >
                <Text style={[styles.personaPillText, activeCategory === cat && styles.personaPillTextActive]}>
                  {CATEGORY_BADGES[cat] ?? cat}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setActiveCategory("All")} style={styles.personaPill}>
              <Text style={styles.personaPillText}>All {terms.length}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : null}

      <View style={styles.searchContainer}>
        <BrandSearchPrefix />
        <TextInput
          style={styles.searchInput}
          placeholder="Search terms..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
          >
            <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
              {cat === "All" ? "All" : CATEGORY_BADGES[cat] ?? cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={groupedSections}
        keyExtractor={(g) => g.category}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        renderItem={({ item: section }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{section.category}</Text>
            {section.items.map((term) => (
              <TouchableOpacity
                key={term.term}
                style={styles.termCard}
                onPress={() => setSelectedTerm(term)}
                activeOpacity={0.7}
              >
                <View style={[styles.termDot, { backgroundColor: CATEGORY_COLORS[term.category] || "#677184" }]} />
                <View style={{ flex: 1 }}>
                  <View style={styles.termHeader}>
                    <Text style={styles.termName}>{term.term}</Text>
                    <Text style={styles.termBadge}>{CATEGORY_BADGES[term.category] ?? term.category}</Text>
                  </View>
                  <Text style={styles.termPreview} numberOfLines={2}>{term.definition}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No terms found. Try another search or category.</Text>
        }
      />

      <Modal visible={!!selectedTerm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedTerm(null)}>
        {selectedTerm && (
          <ScrollView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTerm.term}</Text>
              <TouchableOpacity onPress={() => setSelectedTerm(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalCat}>{CATEGORY_BADGES[selectedTerm.category] ?? selectedTerm.category}</Text>
              <Text style={styles.modalDef}>{selectedTerm.definition}</Text>
              {selectedTerm.context ? (
                <View style={styles.traderBox}>
                  <Text style={styles.traderLabel}>Trader explanation</Text>
                  <Text style={styles.traderText}>{selectedTerm.context}</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { backgroundColor: NAVY, padding: 20 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 13 },
  errorBanner: { backgroundColor: "#fef2f2", padding: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  errorText: { color: "#dc2626", fontSize: 12, flex: 1 },
  retryText: { color: PRIMARY, fontWeight: "700", fontSize: 12 },
  personaBanner: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#eef4ff",
    borderWidth: 1,
    borderColor: "#c7d9ff",
  },
  personaBannerLabel: { fontSize: 10, fontWeight: "700", color: NAVY, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 4 },
  personaBannerHeadline: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 4 },
  personaBannerTip: { fontSize: 12, color: "#677184", lineHeight: 18, marginBottom: 10 },
  personaPills: { gap: 8, paddingRight: 8 },
  personaPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: "#fff", borderWidth: 1, borderColor: "#c7d9ff" },
  personaPillActive: { backgroundColor: NAVY, borderColor: NAVY },
  personaPillText: { fontSize: 11, fontWeight: "600", color: NAVY },
  personaPillTextActive: { color: "#fff" },
  searchContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  searchInput: { flex: 1, paddingHorizontal: 8, paddingVertical: 10, fontSize: 14, color: "#1a1a1a" },
  categories: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f2f4f7" },
  categoryBtnActive: { backgroundColor: NAVY },
  categoryText: { fontSize: 12, fontWeight: "600", color: "#677184" },
  categoryTextActive: { color: "#fff" },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: PRIMARY,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e7ec",
  },
  termCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    marginBottom: 8,
  },
  termDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  termHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 4 },
  termName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  termBadge: { fontSize: 10, fontWeight: "600", color: PRIMARY, backgroundColor: "#eeedfe", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: "hidden" },
  termPreview: { fontSize: 12, color: "#677184", lineHeight: 18 },
  emptyText: { textAlign: "center", color: "#677184", fontSize: 14, marginTop: 24 },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#e4e7ec" },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: "#f2f4f7", borderRadius: 8 },
  closeBtnText: { fontSize: 13, fontWeight: "600", color: PRIMARY },
  modalContent: { padding: 20 },
  modalCat: { fontSize: 11, fontWeight: "700", color: PRIMARY, textTransform: "uppercase", marginBottom: 12 },
  modalDef: { fontSize: 15, color: "#374151", lineHeight: 24, marginBottom: 16 },
  traderBox: { borderLeftWidth: 3, borderLeftColor: PRIMARY, paddingLeft: 12, backgroundColor: "#f9fafb", paddingVertical: 12, paddingRight: 8, borderRadius: 8 },
  traderLabel: { fontSize: 10, fontWeight: "700", color: NAVY, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6 },
  traderText: { fontSize: 14, color: "#677184", fontStyle: "italic", lineHeight: 22 },
});
