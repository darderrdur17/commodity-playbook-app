import React, { useEffect, useState, useMemo } from "react";
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { contentApi } from "../../lib/api";

const PRIMARY = "#3280ff";

export default function InterviewQuestionsScreen() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [openId, setOpenId] = useState<string | null>(null);

  async function load() {
    try {
      const data = await contentApi.get<{ questions: any[]; categories: string[] }>("interview-questions");
      setQuestions(data.questions);
      setCategories(["All", ...data.categories.filter((c) => c !== "All")]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return questions.filter((item) => {
      const matchCat = category === "All" || item.category === category;
      const matchSearch = !q || item.question.toLowerCase().includes(q) || item.modelAnswer.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [questions, search, category]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.search} placeholder="Search..." value={search} onChangeText={setSearch} placeholderTextColor="#9ca3af" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cats}>
        {categories.map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setCategory(cat)} style={[styles.catBtn, category === cat && styles.catBtnActive]}>
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />} contentContainerStyle={styles.list}>
        {filtered.map((item) => (
          <TouchableOpacity key={item.id} style={styles.card} onPress={() => setOpenId(openId === item.id ? null : item.id)}>
            <Text style={styles.q}>{item.question}</Text>
            {openId === item.id && <Text style={styles.a}>{item.modelAnswer}</Text>}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  search: { margin: 12, backgroundColor: "#fff", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: "#e4e7ec" },
  cats: { paddingHorizontal: 12, gap: 8, paddingBottom: 8 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: "#f2f4f7" },
  catBtnActive: { backgroundColor: PRIMARY },
  catText: { fontSize: 12, fontWeight: "600", color: "#677184" },
  catTextActive: { color: "#fff" },
  list: { padding: 12, gap: 8, paddingBottom: 32 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#e4e7ec" },
  q: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  a: { marginTop: 10, fontSize: 13, color: "#374151", lineHeight: 20 },
});
