import React, { useState, useMemo, useCallback, useEffect } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView, ActivityIndicator, RefreshControl,
} from "react-native";
import { glossaryApi } from "../../lib/api";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

type GlossaryTerm = { term: string; definition: string; category: string };

const CATEGORY_COLORS: Record<string, string> = {
  "Physical Trading": PRIMARY,
  Finance: "#0040f5",
  Operations: "#0F766E",
  Legal: "#B45309",
  Pricing: "#9A3412",
};

export default function GlossaryTab() {
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);

  const load = useCallback(async () => {
    try {
      const data = await glossaryApi.getAll();
      setTerms(data.terms);
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
    const cats = new Set(terms.map((t) => t.category));
    return ["All", ...Array.from(cats).sort()];
  }, [terms]);

  const filtered = useMemo(() => {
    return terms
      .filter((t) => {
        const matchSearch =
          t.term.toLowerCase().includes(search.toLowerCase()) ||
          t.definition.toLowerCase().includes(search.toLowerCase());
        const matchCat = activeCategory === "All" || t.category === activeCategory;
        return matchSearch && matchCat;
      })
      .sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory, terms]);

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
        <Text style={styles.headerSub}>{terms.length} terms · Synced with web</Text>
      </View>

      {error ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => { setLoading(true); load(); }}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.searchContainer}>
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
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.term}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        contentContainerStyle={{ padding: 16, gap: 8, paddingBottom: 32 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.termCard} onPress={() => setSelectedTerm(item)} activeOpacity={0.7}>
            <View style={[styles.termDot, { backgroundColor: CATEGORY_COLORS[item.category] || "#677184" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.termName}>{item.term}</Text>
              <Text style={styles.termPreview} numberOfLines={1}>{item.definition}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selectedTerm} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectedTerm(null)}>
        {selectedTerm && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTerm.term}</Text>
              <TouchableOpacity onPress={() => setSelectedTerm(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={styles.modalCat}>{selectedTerm.category}</Text>
              <Text style={styles.modalDef}>{selectedTerm.definition}</Text>
            </View>
          </View>
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
  searchContainer: { backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e4e7ec" },
  searchInput: { backgroundColor: "#f9fafb", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, fontSize: 14, borderWidth: 1, borderColor: "#e4e7ec", color: "#1a1a1a" },
  categories: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  categoryBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f2f4f7" },
  categoryBtnActive: { backgroundColor: PRIMARY },
  categoryText: { fontSize: 12, fontWeight: "600", color: "#677184" },
  categoryTextActive: { color: "#fff" },
  termCard: { flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#e4e7ec" },
  termDot: { width: 10, height: 10, borderRadius: 5 },
  termName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 2 },
  termPreview: { fontSize: 12, color: "#677184" },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: { flexDirection: "row", alignItems: "center", padding: 20, borderBottomWidth: 1, borderBottomColor: "#e4e7ec" },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  closeBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: "#f2f4f7", borderRadius: 8 },
  closeBtnText: { fontSize: 13, fontWeight: "600", color: PRIMARY },
  modalContent: { padding: 20 },
  modalCat: { fontSize: 11, fontWeight: "700", color: PRIMARY, textTransform: "uppercase", marginBottom: 12 },
  modalDef: { fontSize: 15, color: "#374151", lineHeight: 24 },
});
