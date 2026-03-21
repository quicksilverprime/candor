import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LANGUAGES = [
  { code: 'en', label: 'English', flag: 'EN', native: 'English' },
  { code: 'es', label: 'Spanish', flag: 'ES', native: 'Español' },
  { code: 'fr', label: 'French', flag: 'FR', native: 'Français' },
];

const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: 'Respond in English.',
  es: 'Responde completamente en español.',
  fr: 'Réponds entièrement en français.',
};

const QUESTION_TYPES = {
  spark: {
    name: 'The Spark', label: "Today's spark",
    bg: '#09060E', bg2: '#060410', accent: '#F0C020', accentFade: '#F87030',
    text: '#D09018', muted: '#2A1A04', border: '#1E1004',
    subtagline: 'THE SPARK', gradStart: '#F0C020', gradEnd: '#F87030', ctxColor: '#1E1004',
  },
  mirror: {
    name: 'The Mirror', label: "Today's mirror",
    bg: '#E8E6E0', bg2: '#FFFFFF', accent: '#4A4840', accentFade: '#7A7870',
    text: '#2A2820', muted: '#9A9890', border: '#C8C4BC',
    subtagline: 'THE MIRROR', gradStart: '#4A4840', gradEnd: '#7A7870', ctxColor: '#9A9890',
  },
  gauntlet: {
    name: 'The Gauntlet', label: "Today's gauntlet",
    bg: '#0A0404', bg2: '#060202', accent: '#E02020', accentFade: '#F05030',
    text: '#C01818', muted: '#2A0808', border: '#200808',
    subtagline: 'THE GAUNTLET', gradStart: '#E02020', gradEnd: '#F05030', ctxColor: '#200808',
  },
  bridge: {
    name: 'The Bridge', label: "Today's bridge",
    bg: '#FAF5EE', bg2: '#FFFFFF', accent: '#7A9E78', accentFade: '#C8A060',
    text: '#3A4830', muted: '#A89878', border: '#EDE4D8',
    subtagline: 'THE BRIDGE', gradStart: '#7A9E78', gradEnd: '#C8A060', ctxColor: '#A89878',
  },
  horizon: {
    name: 'The Horizon', label: "Today's horizon",
    bg: '#060C18', bg2: '#040810', accent: '#4898D8', accentFade: '#88C8F0',
    text: '#4898D8', muted: '#183040', border: '#0E2034',
    subtagline: 'THE HORIZON', gradStart: '#4898D8', gradEnd: '#88C8F0', ctxColor: '#102030',
  },
};

type QuestionType = keyof typeof QUESTION_TYPES;

const API_URL = `${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/ask`;

async function fetchQuestion(language: string): Promise<{ type: QuestionType; question: string; context: string } | null> {
  const dateStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const langInstruction = LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `You are Candor. Today is ${dateStr}. ${langInstruction}

Generate ONE daily question for coworkers that replaces "how are you?". Choose a question type:
- spark: high energy, curiosity
- mirror: low energy, internal truth
- gauntlet: confrontational, breaks stagnation
- bridge: connection, vulnerability
- horizon: future-focused

One direct sentence. No preamble.

Respond ONLY with this exact JSON structure, nothing else:
{"type":"bridge","question":"your question here","context":"short context here"}`,
        }],
      }),
    });

    if (!response.ok) {
      console.log('API error:', response.status);
      return null;
    }

    const data = await response.json();
    const rawText = data?.content?.[0]?.text;
    if (!rawText) {
      console.log('No text in response');
      return null;
    }

    const cleaned = rawText.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!parsed.question || !parsed.type) {
      console.log('Invalid parsed response:', parsed);
      return null;
    }

    return {
      type: (parsed.type as QuestionType) || 'bridge',
      question: parsed.question,
      context: parsed.context || '',
    };
  } catch (e) {
    console.log('Fetch error:', e);
    return null;
  }
}

function ResonatingC({ type }: { type: QuestionType }) {
  const t = QUESTION_TYPES[type];
  return (
    <Svg width={SCREEN_WIDTH - 96} height={44} viewBox="0 0 260 44">
      <Defs>
        <LinearGradient id="cg1" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={t.gradStart} />
          <Stop offset="100%" stopColor={t.gradEnd} />
        </LinearGradient>
        <LinearGradient id="cg2" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={t.gradStart} stopOpacity="0.5" />
          <Stop offset="100%" stopColor={t.gradEnd} stopOpacity="0.2" />
        </LinearGradient>
        <LinearGradient id="cg3" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={t.gradStart} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={t.gradEnd} stopOpacity="0.1" />
        </LinearGradient>
      </Defs>
      <Path d="M22,4 A18,18 0 0 0 22,40" fill="none" stroke="url(#cg3)" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M22,10 A12,12 0 0 0 22,34" fill="none" stroke="url(#cg2)" strokeWidth="4" strokeLinecap="round" />
      <Path d="M22,15 A7,7 0 0 0 22,29" fill="none" stroke="url(#cg1)" strokeWidth="4.5" strokeLinecap="round" />
      <SvgText x="48" y="20" fontFamily="System" fontSize="13" fontWeight="300" fill={t.accent} letterSpacing={5}>CANDOR</SvgText>
      <SvgText x="49" y="34" fontFamily="System" fontSize="7" fill={t.muted} letterSpacing={2}>{t.subtagline}</SvgText>
    </Svg>
  );
}

function RippleEffect({ accent, trigger }: { accent: string; trigger: number }) {
  const anims = [0, 1, 2].map(() => ({
    scale: useRef(new Animated.Value(0)).current,
    opacity: useRef(new Animated.Value(0)).current,
  }));

  useEffect(() => {
    if (trigger === 0) return;
    anims.forEach(a => { a.scale.setValue(0); a.opacity.setValue(0); });
    anims.forEach((a, i) => {
      Animated.sequence([
        Animated.delay(i * 180),
        Animated.parallel([
          Animated.timing(a.scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
          Animated.sequence([
            Animated.timing(a.opacity, { toValue: 0.35, duration: 100, useNativeDriver: true }),
            Animated.timing(a.opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
          ]),
        ]),
      ]).start();
    });
  }, [trigger]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {anims.map((a, i) => {
        const size = 100 + i * 60;
        return (
          <Animated.View key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: accent,
            top: '35%', left: '50%',
            marginLeft: -(size / 2), marginTop: -(size / 2),
            opacity: a.opacity,
            transform: [{ scale: a.scale.interpolate({ inputRange: [0, 1], outputRange: [0.2, 3.5] }) }],
          }} />
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const [questionType, setQuestionType] = useState<QuestionType>('bridge');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const [language, setLanguage] = useState('en');
  const [langPickerVisible, setLangPickerVisible] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const t = QUESTION_TYPES[questionType];

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const savedLang = await AsyncStorage.getItem('language') || 'en';
    setLanguage(savedLang);
    await loadStreak();
    await loadOrFetchQuestion(savedLang);
  }

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

  async function loadOrFetchQuestion(lang: string) {
    setLoading(true);
    const today = new Date().toDateString();
    const cachedDate = await AsyncStorage.getItem('questionDate');
    const cachedLang = await AsyncStorage.getItem('questionLang');
    const cachedQ = await AsyncStorage.getItem('questionText');
    const cachedCtx = await AsyncStorage.getItem('questionContext');
    const cachedType = await AsyncStorage.getItem('questionType') as QuestionType | null;

    if (cachedDate === today && cachedLang === lang && cachedQ) {
      setQuestion(cachedQ);
      setContext(cachedCtx || '');
      applyType((cachedType as QuestionType) || 'bridge');
      setLoading(false);
      return;
    }

    const result = await fetchQuestion(lang);
    if (result) {
      await AsyncStorage.setItem('questionDate', today);
      await AsyncStorage.setItem('questionLang', lang);
      await AsyncStorage.setItem('questionText', result.question);
      await AsyncStorage.setItem('questionContext', result.context);
      await AsyncStorage.setItem('questionType', result.type);
      setQuestion(result.question);
      setContext(result.context);
      applyType(result.type);
    } else {
      setQuestion('What would you do differently if you started this job over?');
      setContext('The answer reveals what actually matters to someone.');
      applyType('bridge');
    }
    setLoading(false);
  }

  function applyType(type: QuestionType) {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();
    setRippleTrigger(n => n + 1);
    setQuestionType(type);
  }

  async function changeLanguage(code: string) {
    setLangPickerVisible(false);
    setLanguage(code);
    await AsyncStorage.setItem('language', code);
    await AsyncStorage.multiRemove(['questionDate', 'questionText', 'questionContext', 'questionType', 'questionLang']);
    await loadOrFetchQuestion(code);
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <RippleEffect accent={t.accent} trigger={rippleTrigger} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>

          <View style={styles.logoRow}>
            <ResonatingC type={questionType} />
            <TouchableOpacity
              style={[styles.globeBtn, { borderColor: t.border }]}
              onPress={() => setLangPickerVisible(true)}
            >
              <Text style={[styles.globeText, { color: t.accent }]}>{currentLang?.flag || 'EN'}</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.divider, { backgroundColor: t.border }]} />

          <View style={styles.orrerySection}>
            <View style={[styles.orrery, { borderColor: t.accent }]}>
              <View style={[styles.orreryInner, { borderColor: t.border }]} />
              <Text style={[styles.orreryNum, { color: t.accent }]}>{streak}</Text>
            </View>
            <Text style={[styles.orreryLabel, { color: t.muted }]}>day streak</Text>
          </View>

          <View style={styles.tickRow}>
            {[1, 1, 1, 1, 1, 0.5, 0].map((v, i) => (
              <View key={i} style={[
                styles.tick,
                v === 1 ? { backgroundColor: t.accent }
                : v === 0.5 ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: t.accent }
                : { backgroundColor: t.border },
              ]} />
            ))}
          </View>

          <Text style={[styles.dateLabel, { color: t.muted }]}>{today}</Text>

          <View style={[styles.card, { backgroundColor: t.bg2, borderColor: t.border, borderLeftColor: t.accent }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.cardEyebrow, { color: t.muted }]}>{t.label}</Text>
              <View style={[styles.typePill, { borderColor: t.border }]}>
                <Text style={[styles.typePillText, { color: t.accent }]}>{t.name}</Text>
              </View>
            </View>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={t.accent} size="small" />
                <Text style={[styles.loadingText, { color: t.muted }]}>Finding today's question…</Text>
              </View>
            ) : (
              <>
                <Text style={[styles.questionText, { color: t.text }]}>{`"${question}"`}</Text>
                <View style={[styles.cardDivider, { backgroundColor: t.border }]} />
                <Text style={[styles.contextText, { color: t.ctxColor }]}>{context}</Text>
              </>
            )}
          </View>

          <View style={[styles.methodCard, { backgroundColor: t.bg2, borderColor: t.border }]}>
            <Text style={[styles.methodTitle, { color: t.muted }]}>The method</Text>
            <Text style={[styles.methodBody, { color: t.muted }]}>
              Tomorrow morning, skip the small talk. Walk up to someone and ask this instead. Then actually listen.
            </Text>
          </View>

          {todayDone && (
            <View style={[styles.doneRow, { borderColor: t.border }]}>
              <Text style={[styles.doneText, { color: t.accent }]}>✦ You showed up today. See you tomorrow.</Text>
            </View>
          )}

        </Animated.View>
      </ScrollView>

      <Modal
        visible={langPickerVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setLangPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLangPickerVisible(false)}
        >
          <View style={[styles.langPicker, { backgroundColor: t.bg2, borderColor: t.border }]}>
            <Text style={[styles.langTitle, { color: t.muted }]}>Language</Text>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langOption,
                  { borderColor: t.border },
                  language === lang.code && { backgroundColor: t.bg },
                ]}
                onPress={() => changeLanguage(lang.code)}
              >
                <Text style={[styles.langCode, { color: t.accent }]}>{lang.flag}</Text>
                <View style={styles.langLabels}>
                  <Text style={[styles.langLabel, { color: t.text }]}>{lang.native}</Text>
                  <Text style={[styles.langSub, { color: t.muted }]}>{lang.label}</Text>
                </View>
                {language === lang.code && (
                  <Text style={[styles.langCheck, { color: t.accent }]}>✦</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 64, paddingBottom: 48 },
  logoRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 },
  globeBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  globeText: { fontSize: 11, fontWeight: '600', letterSpacing: 0.5 },
  divider: { height: 1, marginBottom: 22 },
  orrerySection: { alignItems: 'center', marginBottom: 8 },
  orrery: { width: 64, height: 64, borderRadius: 32, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  orreryInner: { position: 'absolute', width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderStyle: 'dashed' },
  orreryNum: { fontSize: 24, fontWeight: '300', zIndex: 1 },
  orreryLabel: { fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', marginTop: 6, marginBottom: 18 },
  tickRow: { flexDirection: 'row', gap: 4, justifyContent: 'center', marginBottom: 20 },
  tick: { width: 6, height: 14, borderRadius: 1 },
  dateLabel: { fontSize: 10, fontWeight: '500', letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 12 },
  card: { borderRadius: 12, borderWidth: 1, borderLeftWidth: 3, padding: 20, marginBottom: 14, minHeight: 120 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardEyebrow: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
  typePill: { borderWidth: 1, borderRadius: 3, paddingHorizontal: 8, paddingVertical: 3 },
  typePillText: { fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 60 },
  loadingText: { fontSize: 14, fontStyle: 'italic' },
  questionText: { fontSize: 20, lineHeight: 30, fontStyle: 'italic', fontWeight: '300', marginBottom: 16 },
  cardDivider: { height: 1, marginBottom: 12 },
  contextText: { fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  methodCard: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 14 },
  methodTitle: { fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 },
  methodBody: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  doneRow: { borderTopWidth: 1, paddingTop: 14, alignItems: 'center' },
  doneText: { fontSize: 12, letterSpacing: 0.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-start', alignItems: 'flex-end', paddingTop: 120, paddingRight: 24 },
  langPicker: { borderRadius: 14, borderWidth: 1, padding: 12, minWidth: 200 },
  langTitle: { fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8, paddingHorizontal: 4 },
  langOption: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: 8, borderWidth: 0.5, marginBottom: 6 },
  langCode: { fontSize: 13, fontWeight: '700', minWidth: 24 },
  langLabels: { flex: 1 },
  langLabel: { fontSize: 14, fontWeight: '400' },
  langSub: { fontSize: 11, marginTop: 1 },
  langCheck: { fontSize: 12 },
});