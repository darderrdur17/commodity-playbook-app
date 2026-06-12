import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { contentApi } from "../../lib/api";

const PRIMARY = "#3280ff";

export default function KnowledgeTestScreen() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    try {
      const data = await contentApi.get<{ questions: any[] }>("knowledge-test");
      setQuestions(data.questions);
      setAnswers({});
      setSubmitted(false);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const score = submitted
    ? questions.filter((q) => answers[q.id] === q.correctIndex).length
    : 0;

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
    >
      {submitted && (
        <View style={styles.scoreCard}>
          <Text style={styles.scoreText}>Score: {score} / {questions.length}</Text>
        </View>
      )}
      {questions.map((q, qi) => (
        <View key={q.id} style={styles.card}>
          <Text style={styles.qLabel}>Q{qi + 1} · {q.topic}</Text>
          <Text style={styles.q}>{q.question}</Text>
          {q.options.map((opt: string, i: number) => {
            const selected = answers[q.id] === i;
            const showCorrect = submitted && i === q.correctIndex;
            return (
              <TouchableOpacity
                key={i}
                disabled={submitted}
                onPress={() => setAnswers((prev) => ({ ...prev, [q.id]: i }))}
                style={[styles.opt, selected && styles.optSelected, showCorrect && styles.optCorrect]}
              >
                <Text style={styles.optText}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
      {!submitted && (
        <TouchableOpacity
          style={styles.submit}
          onPress={() => setSubmitted(true)}
          disabled={questions.some((q) => answers[q.id] === undefined)}
        >
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  scoreCard: { backgroundColor: "#eff6ff", borderRadius: 12, padding: 14 },
  scoreText: { fontSize: 16, fontWeight: "700", color: PRIMARY },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#e4e7ec" },
  qLabel: { fontSize: 11, color: "#677184", marginBottom: 4 },
  q: { fontSize: 14, fontWeight: "600", color: "#1a1a1a", marginBottom: 10 },
  opt: { padding: 10, borderRadius: 8, borderWidth: 1, borderColor: "#e4e7ec", marginBottom: 6 },
  optSelected: { borderColor: PRIMARY, backgroundColor: "#eff6ff" },
  optCorrect: { borderColor: "#16a34a", backgroundColor: "#f0fdf4" },
  optText: { fontSize: 13, color: "#374151" },
  submit: { backgroundColor: PRIMARY, borderRadius: 10, padding: 14, alignItems: "center" },
  submitText: { color: "#fff", fontWeight: "700" },
});
