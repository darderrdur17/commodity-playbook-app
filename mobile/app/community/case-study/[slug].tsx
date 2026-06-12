import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { caseStudiesApi } from "../../../lib/api";

const PRIMARY = "#3280ff";
const ELITE = "#B45309";

function Paragraph({ text }: { text: string }) {
  const isQuote = text.startsWith("*") && text.endsWith("*") && !text.startsWith("**");
  if (isQuote) {
    return (
      <View style={styles.quote}>
        <Text style={styles.quoteText}>{text.slice(1, -1)}</Text>
      </View>
    );
  }
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return (
    <Text style={styles.para}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <Text key={i} style={styles.bold}>{part}</Text>
        ) : (
          part
        )
      )}
    </Text>
  );
}

export default function CaseStudyDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [data, setData] = useState<{ card: any; sections: any[] | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    caseStudiesApi.get(slug)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={ELITE} size="large" />
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || "Not found"}</Text>
      </View>
    );
  }

  const { card, sections } = data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.category}>{card.category}</Text>
      <Text style={styles.title}>{card.title}</Text>
      <Text style={styles.catch}>{card.catchLine}</Text>
      <Text style={styles.meta}>{card.readMinutes} min read</Text>
      <Text style={styles.intro}>{card.description}</Text>

      {sections?.map((section) => (
        <View key={section.id} style={styles.section}>
          <Text style={styles.sectionLabel}>{section.label}</Text>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionBody}>
            {section.paragraphs.map((p: string, i: number) => (
              <Paragraph key={i} text={p} />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  content: { padding: 16, paddingBottom: 40 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  errorText: { color: "#dc2626", textAlign: "center" },
  category: { fontSize: 10, fontWeight: "700", color: ELITE, textTransform: "uppercase", marginBottom: 8 },
  title: { fontSize: 22, fontWeight: "700", color: "#1a1a1a", marginBottom: 8, lineHeight: 28 },
  catch: { fontSize: 14, fontStyle: "italic", color: "#677184", marginBottom: 6 },
  meta: { fontSize: 12, color: "#9ca3af", marginBottom: 16 },
  intro: { fontSize: 14, color: "#465468", lineHeight: 21, marginBottom: 20 },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: PRIMARY, letterSpacing: 1, marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#1a1a1a", marginBottom: 10, lineHeight: 24 },
  sectionBody: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e4e7ec",
  },
  para: { fontSize: 14, color: "#465468", lineHeight: 22, marginBottom: 12 },
  bold: { fontWeight: "700", color: "#1a1a1a" },
  quote: {
    borderLeftWidth: 3,
    borderLeftColor: PRIMARY,
    paddingLeft: 12,
    marginVertical: 8,
  },
  quoteText: { fontSize: 14, fontStyle: "italic", color: "#333", lineHeight: 21 },
});
