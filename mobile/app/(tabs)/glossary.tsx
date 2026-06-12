import React, { useState, useMemo } from "react";
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, Modal, ScrollView
} from "react-native";

const NAVY = "#0830a0";
const PRIMARY = "#3280ff";

const TERMS = [
  { term: "Basis", def: "The difference between the spot price of a commodity and the price of a futures contract.", category: "Pricing" },
  { term: "Backwardation", def: "A market condition where the spot price is higher than the futures price. Signals tight near-term supply.", category: "Pricing" },
  { term: "Contango", def: "A market condition where the futures price is higher than the spot price. Reflects storage costs.", category: "Pricing" },
  { term: "Arbitrage", def: "Simultaneous purchase and sale of a commodity in different markets to profit from a price differential.", category: "Physical Trading" },
  { term: "Hedging", def: "Taking an offsetting position in futures or derivatives to reduce price risk on a physical position.", category: "Finance" },
  { term: "FOB", def: "Free On Board — seller bears costs until goods are loaded onto the vessel at the named port.", category: "Legal" },
  { term: "CIF", def: "Cost, Insurance and Freight — seller pays cost of goods, insurance, and freight to destination port.", category: "Legal" },
  { term: "Demurrage", def: "Charges incurred when a vessel is detained beyond the agreed laytime. Charged per day.", category: "Operations" },
  { term: "Mark-to-Market", def: "Daily revaluation of open trading positions at current market prices.", category: "Finance" },
  { term: "Crack Spread", def: "The price difference between crude oil and refined products. Measures refinery margins.", category: "Pricing" },
  { term: "Netback", def: "Value of a commodity calculated by starting from end-use price and subtracting all costs back to production.", category: "Pricing" },
  { term: "Letter of Credit", def: "A bank document guaranteeing a buyer's payment will be received on time and for the correct amount.", category: "Legal" },
  { term: "VaR", def: "Value at Risk — statistical measure of potential loss over a defined period at a confidence interval.", category: "Finance" },
  { term: "Flat Price", def: "The outright price of a commodity. Trading flat price means taking directional exposure.", category: "Pricing" },
  { term: "Spread Trading", def: "Trading the price difference between two related instruments — grades, locations, or time periods.", category: "Physical Trading" },
];

const CATEGORIES = ["All", "Physical Trading", "Finance", "Operations", "Legal", "Pricing"];

const CATEGORY_COLORS: Record<string, string> = {
  "Physical Trading": PRIMARY,
  Finance: "#0040f5",
  Operations: "#0F766E",
  Legal: "#B45309",
  Pricing: "#9A3412",
};

export default function GlossaryTab() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState<typeof TERMS[0] | null>(null);

  const filtered = useMemo(() => {
    return TERMS.filter((t) => {
      const matchSearch = t.term.toLowerCase().includes(search.toLowerCase()) ||
        t.def.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "All" || t.category === activeCategory;
      return matchSearch && matchCat;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeCategory]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Desk Glossary</Text>
        <Text style={styles.headerSub}>{TERMS.length} terms · Free for all members</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search terms..."
          placeholderTextColor="#9ca3af"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categories}
      >
        {CATEGORIES.map((cat) => (
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

      {/* Terms */}
      <FlatList
        data={filtered}
        keyExtractor={(t) => t.term}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.termCard}
            onPress={() => setSelectedTerm(item)}
            activeOpacity={0.7}
          >
            <View style={[styles.termDot, { backgroundColor: CATEGORY_COLORS[item.category] || "#677184" }]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.termName}>{item.term}</Text>
              <Text style={styles.termPreview} numberOfLines={1}>{item.def}</Text>
            </View>
            <View style={[styles.catBadge, { backgroundColor: `${CATEGORY_COLORS[item.category] || "#677184"}12` }]}>
              <Text style={[styles.catBadgeText, { color: CATEGORY_COLORS[item.category] || "#677184" }]}>
                {item.category}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Term detail modal */}
      <Modal
        visible={!!selectedTerm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTerm(null)}
      >
        {selectedTerm && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <View style={[styles.termDotLarge, { backgroundColor: CATEGORY_COLORS[selectedTerm.category] || "#677184" }]} />
              <Text style={styles.modalTitle}>{selectedTerm.term}</Text>
              <TouchableOpacity onPress={() => setSelectedTerm(null)} style={styles.closeBtn}>
                <Text style={styles.closeBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <View style={[styles.catBadgeLarge, { backgroundColor: `${CATEGORY_COLORS[selectedTerm.category] || "#677184"}12` }]}>
                <Text style={[styles.catBadgeTextLarge, { color: CATEGORY_COLORS[selectedTerm.category] || "#677184" }]}>
                  {selectedTerm.category}
                </Text>
              </View>
              <Text style={styles.modalDef}>{selectedTerm.def}</Text>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  header: { backgroundColor: NAVY, padding: 20 },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "bold", fontFamily: "serif", marginBottom: 4 },
  headerSub: { color: "rgba(255,255,255,0.55)", fontSize: 13 },
  searchContainer: { backgroundColor: "#fff", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e4e7ec" },
  searchInput: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
    color: "#1a1a1a",
  },
  categories: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  categoryBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f2f4f7",
  },
  categoryBtnActive: { backgroundColor: PRIMARY },
  categoryText: { fontSize: 12, fontWeight: "600", color: "#677184" },
  categoryTextActive: { color: "#fff" },
  termCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  termDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0, marginTop: 2 },
  termName: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", marginBottom: 2 },
  termPreview: { fontSize: 12, color: "#677184" },
  catBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  catBadgeText: { fontSize: 10, fontWeight: "700" },
  modalContainer: { flex: 1, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e7ec",
  },
  termDotLarge: { width: 14, height: 14, borderRadius: 7 },
  modalTitle: { flex: 1, fontSize: 20, fontWeight: "700", color: "#1a1a1a", fontFamily: "serif" },
  closeBtn: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: "#f2f4f7", borderRadius: 8 },
  closeBtnText: { fontSize: 13, fontWeight: "600", color: "#3280ff" },
  modalContent: { padding: 20 },
  catBadgeLarge: { alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginBottom: 14 },
  catBadgeTextLarge: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5 },
  modalDef: { fontSize: 15, color: "#374151", lineHeight: 24 },
});
