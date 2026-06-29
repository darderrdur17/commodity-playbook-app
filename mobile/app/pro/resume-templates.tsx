import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Alert,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { API_URL, authApi, contentApi } from "../../lib/api";
import { PERSONA_ID_TO_API, scorePersonaQuiz, type PersonaId } from "../../lib/persona-quiz";

const PRIMARY = "#3280ff";
const NAVY = "#0830a0";

const ARCHETYPE_LABELS: Record<PersonaId, { name: string; emoji: string }> = {
  switcher: { name: "The Switcher", emoji: "🔄" },
  insider: { name: "The Insider", emoji: "🏠" },
  analyst: { name: "The Analyst-to-Trader", emoji: "📊" },
  vendor: { name: "The Vendor", emoji: "📡" },
  fresh_grad: { name: "The Fresh Graduate", emoji: "🎓" },
};

export default function ResumeTemplatesScreen() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [quizSteps, setQuizSteps] = useState<any[]>([]);
  const [assetUrls, setAssetUrls] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizComplete, setQuizComplete] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const savedRef = useRef<PersonaId | null>(null);

  async function load() {
    try {
      const data = await contentApi.get<{ templates: any[]; quizSteps?: any[]; assetUrls: Record<string, string> }>("resume-templates");
      setTemplates(data.templates);
      setQuizSteps(data.quizSteps || []);
      setAssetUrls(data.assetUrls || {});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  const scoreResult = useMemo(
    () => scorePersonaQuiz({ q1: answers.q1, q2: answers.q2, q3: answers.q3, q4: answers.q4, q5: answers.q5 }),
    [answers]
  );

  const recommendedId = quizComplete && Object.keys(answers).length >= 4 ? scoreResult.personaId : null;

  useEffect(() => {
    if (!recommendedId || savedRef.current === recommendedId) return;
    savedRef.current = recommendedId;

    async function save() {
      setSaveStatus("saving");
      try {
        const me = await authApi.me();
        await authApi.savePersona(PERSONA_ID_TO_API[recommendedId!], me.user?.track);
        setSaveStatus("saved");
      } catch {
        savedRef.current = null;
        setSaveStatus("error");
      }
    }
    save();
  }, [recommendedId]);

  async function openTemplate(template: any) {
    const cmsUrl = assetUrls[template.templateFile];
    if (cmsUrl) {
      await WebBrowser.openBrowserAsync(`${API_URL}${cmsUrl}`);
      return;
    }
    await WebBrowser.openBrowserAsync(`${API_URL}/templates/${template.templateFile}`);
  }

  const currentStep = quizSteps[step];

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={PRIMARY} size="large" /></View>;
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 32 }}
    >
      <View style={styles.quizCard}>
        <Text style={styles.quizTitle}>Persona Analysis Quiz</Text>
        <Text style={styles.quizSub}>5 questions · weighted scoring</Text>

        {quizComplete && recommendedId ? (
          <View style={styles.resultBox}>
            <Text style={styles.resultEmoji}>{ARCHETYPE_LABELS[recommendedId].emoji}</Text>
            <Text style={styles.resultName}>{ARCHETYPE_LABELS[recommendedId].name}</Text>
            <Text style={styles.resultMatch}>{scoreResult.confidence}% match</Text>
            {saveStatus === "saved" && (
              <Text style={styles.savedText}>Saved to your profile — synced with web</Text>
            )}
            {saveStatus === "error" && (
              <Text style={styles.errorText}>Could not save persona. Sign in and retry.</Text>
            )}
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={() => {
                setQuizComplete(false);
                setStep(0);
                setAnswers({});
                setSaveStatus("idle");
                savedRef.current = null;
              }}
            >
              <Text style={styles.secondaryBtnText}>Retake quiz</Text>
            </TouchableOpacity>
          </View>
        ) : currentStep ? (
          <>
            <Text style={styles.stepLabel}>Question {step + 1} of {quizSteps.length}</Text>
            <Text style={styles.question}>{currentStep.question}</Text>
            {currentStep.options.map((opt: any) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.option, answers[currentStep.id] === opt.value && styles.optionActive]}
                onPress={() => setAnswers((p) => ({ ...p, [currentStep.id]: opt.value }))}
              >
                <Text style={styles.optionText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <View style={styles.quizNav}>
              <TouchableOpacity disabled={step === 0} onPress={() => setStep((s) => Math.max(0, s - 1))}>
                <Text style={[styles.navText, step === 0 && { opacity: 0.4 }]}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, !answers[currentStep.id] && { opacity: 0.5 }]}
                disabled={!answers[currentStep.id]}
                onPress={() => {
                  if (step < quizSteps.length - 1) setStep(step + 1);
                  else setQuizComplete(true);
                }}
              >
                <Text style={styles.primaryBtnText}>{step === quizSteps.length - 1 ? "See result" : "Next"}</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : null}
      </View>

      {templates.map((t) => {
        const isRec = recommendedId === t.id;
        return (
          <View key={t.id} style={[styles.card, isRec && styles.cardRecommended]}>
            {isRec && <Text style={styles.recBadge}>Recommended for you</Text>}
            <Text style={styles.label}>{t.label}</Text>
            <Text style={styles.desc}>{t.positioningChallenge}</Text>
            <TouchableOpacity style={styles.btn} onPress={() => openTemplate(t)}>
              <Text style={styles.btnText}>Open / Download</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  quizCard: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e4e7ec" },
  quizTitle: { fontSize: 17, fontWeight: "700", color: NAVY },
  quizSub: { fontSize: 12, color: "#677184", marginBottom: 12 },
  stepLabel: { fontSize: 10, fontWeight: "700", color: NAVY, textTransform: "uppercase", marginBottom: 6 },
  question: { fontSize: 15, fontWeight: "600", color: "#1a1a1a", marginBottom: 10 },
  option: { borderWidth: 1, borderColor: "#e4e7ec", borderRadius: 10, padding: 12, marginBottom: 8 },
  optionActive: { borderColor: PRIMARY, backgroundColor: "#eef4ff" },
  optionText: { fontSize: 13, color: "#1a1a1a", lineHeight: 18 },
  quizNav: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  navText: { color: "#677184", fontWeight: "600" },
  primaryBtn: { backgroundColor: PRIMARY, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 10 },
  primaryBtnText: { color: "#fff", fontWeight: "700" },
  secondaryBtn: { marginTop: 12, alignItems: "center" },
  secondaryBtnText: { color: PRIMARY, fontWeight: "600" },
  resultBox: { alignItems: "center", paddingVertical: 8 },
  resultEmoji: { fontSize: 32 },
  resultName: { fontSize: 20, fontWeight: "700", color: "#1a1a1a", marginTop: 4 },
  resultMatch: { fontSize: 12, color: NAVY, marginTop: 4 },
  savedText: { fontSize: 12, color: "#0F766E", marginTop: 8 },
  errorText: { fontSize: 12, color: "#dc2626", marginTop: 8 },
  card: { backgroundColor: "#fff", borderRadius: 14, padding: 16, borderWidth: 1, borderColor: "#e4e7ec" },
  cardRecommended: { borderColor: PRIMARY, borderWidth: 2 },
  recBadge: { fontSize: 10, fontWeight: "700", color: PRIMARY, marginBottom: 6, textTransform: "uppercase" },
  label: { fontSize: 16, fontWeight: "700", color: "#1a1a1a", marginBottom: 6 },
  desc: { fontSize: 13, color: "#677184", lineHeight: 20, marginBottom: 12 },
  btn: { backgroundColor: PRIMARY, borderRadius: 8, padding: 12, alignItems: "center" },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
