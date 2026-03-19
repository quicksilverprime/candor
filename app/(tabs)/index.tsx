import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);

  useEffect(() => {
    loadStreak();
    loadDailyQuestion();
  }, []);

  async function loadStreak() {
    try {
      const lastDate = await AsyncStorage.getItem('lastOpenDate');
      const savedStreak = await AsyncStorage.getItem('streak');
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      let currentStreak = parseInt(savedStreak || '0');
      if (lastDate === today) {
        setTodayDone(true);
        setStreak(currentStreak);
      } else if (lastDate === yesterday) {
        currentStreak += 1;
        await AsyncStorage.setItem('streak', String(currentStreak));
        await AsyncStorage.setItem('lastOpenDate', today);
        setStreak(currentStreak);
      } else {
        currentStreak = 1;
        await AsyncStorage.setItem('streak', '1');
        await AsyncStorage.setItem('lastOpenDate', today);
        setStreak(1);
      }
    } catch {
      setStreak(0);
    }
  }

  async function loadDailyQuestion() {
    const today = new Date().toDateString();
    const cachedDate = await AsyncStorage.getItem('questionDate');
    const cachedQuestion = await AsyncStorage.getItem('questionText');
    const cachedContext = await AsyncStorage.getItem('questionContext');
    if (cachedDate === today && cachedQuestion) {
      setQuestion(cachedQuestion);
      setContext(cachedContext || '');
      setLoading(false);
      return;
    }
    await fetchNewQuestion(today);
  }

  async function fetchNewQuestion(today: string) {
    setLoading(true);
    try {
      const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric',
      });
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY || '',
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `You are Candor. Today is ${dateStr}. Generate the daily question for coworkers. The question should replace "how are you?" in a morning interaction. Make it slightly uncomfortable in a good way — specific enough to feel personal, universal enough for anyone. One sentence, direct, no preamble. Respond ONLY as JSON: {"question": "the question here", "context": "one line on why this question matters — max 12 words"}`,
          }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(raw);
      await AsyncStorage.setItem('questionDate', today);
      await AsyncStorage.setItem('questionText', parsed.question);
      await AsyncStorage.setItem('questionContext', parsed.context || '');
      setQuestion(parsed.question);
      setContext(parsed.context || '');
    } catch {
      setQuestion('What would you do differently if you started this job over?');
      setContext('The answer reveals what actually matters to someone.');
    }
    setLoading(false);
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.logo}>
          {'can'}<Text style={styles.logoItalic}>{'dor'}</Text>
        </Text>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>Free</Text>
        </View>
      </View>

      <View style={styles.streakRow}>
        <View style={styles.streakStat}>
          <Text style={styles.streakNum}>{streak}</Text>
          <Text style={styles.streakLabel}>Day streak</Text>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakStat}>
          <Text style={styles.streakNum}>{todayDone ? '✓' : '–'}</Text>
          <Text style={styles.streakLabel}>Today</Text>
        </View>
        <View style={styles.streakDivider} />
        <View style={styles.streakMessage}>
          <Text style={styles.streakHint}>
            {todayDone
              ? 'You showed up today. See you tomorrow.'
              : 'Open the app daily to build your streak.'}
          </Text>
        </View>
      </View>

      <Text style={styles.dateLabel}>{today}</Text>

      <View style={styles.card}>
        <Text style={styles.cardEyebrow}>Today's question</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#7A5C48" />
            <Text style={styles.loadingText}>Finding today's question…</Text>
          </View>
        ) : (
          <>
            <Text style={styles.questionText}>{question}</Text>
            <View style={styles.cardDivider} />
            <Text style={styles.contextText}>{context}</Text>
          </>
        )}
      </View>

      <View style={styles.hintCard}>
        <Text style={styles.hintTitle}>How to use this</Text>
        <Text style={styles.hintBody}>
          Tomorrow morning, skip the small talk. Walk up to a coworker and ask this question instead. Then actually listen to the answer.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFAF7' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  logo: { fontSize: 28, fontWeight: '700', color: '#2C2018', letterSpacing: -0.5 },
  logoItalic: { fontStyle: 'italic', fontWeight: '400' },
  planBadge: { backgroundColor: '#EDE8E3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  planText: { fontSize: 11, color: '#7A5C48', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  streakRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 28, borderWidth: 0.5, borderColor: '#E8DDD5' },
  streakStat: { alignItems: 'center', paddingHorizontal: 12 },
  streakNum: { fontSize: 24, fontWeight: '700', color: '#2C2018' },
  streakLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: '#A89080', marginTop: 2 },
  streakDivider: { width: 0.5, height: 36, backgroundColor: '#E8DDD5' },
  streakMessage: { flex: 1, paddingLeft: 12 },
  streakHint: { fontSize: 13, color: '#7A5C48', lineHeight: 18 },
  dateLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.8, textTransform: 'uppercase', color: '#A89080', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 28, marginBottom: 16, borderWidth: 0.5, borderColor: '#E8DDD5', minHeight: 100 },
  cardEyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: '#7A5C48', marginBottom: 20 },
  questionText: { fontSize: 22, lineHeight: 32, color: '#2C2018', fontStyle: 'italic', marginBottom: 24, fontWeight: '400' },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 80 },
  loadingText: { fontSize: 15, color: '#A89080', fontStyle: 'italic' },
  cardDivider: { height: 0.5, backgroundColor: '#E8DDD5', marginBottom: 16 },
  contextText: { fontSize: 13, color: '#A89080', lineHeight: 20, fontStyle: 'italic' },
  hintCard: { backgroundColor: '#F0EBE5', borderRadius: 12, padding: 20 },
  hintTitle: { fontSize: 13, fontWeight: '700', color: '#4A3728', marginBottom: 8 },
  hintBody: { fontSize: 14, color: '#7A5C48', lineHeight: 22 },
});