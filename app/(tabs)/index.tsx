import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const QUESTION_TYPES = {
  spark: {
    name: 'The Spark',
    label: "Today's spark",
    bg: '#09060E',
    bg2: '#060410',
    accent: '#F0C020',
    accentFade: '#F87030',
    text: '#D09018',
    muted: '#2A1A04',
    border: '#1E1004',
    subtagline: 'THE SPARK',
    gradStart: '#F0C020',
    gradEnd: '#F87030',
    ctxColor: '#1E1004',
  },
  mirror: {
    name: 'The Mirror',
    label: "Today's mirror",
    bg: '#E8E6E0',
    bg2: '#FFFFFF',
    accent: '#4A4840',
    accentFade: '#7A7870',
    text: '#2A2820',
    muted: '#9A9890',
    border: '#C8C4BC',
    subtagline: 'THE MIRROR',
    gradStart: '#4A4840',
    gradEnd: '#7A7870',
    ctxColor: '#9A9890',
  },
  gauntlet: {
    name: 'The Gauntlet',
    label: "Today's gauntlet",
    bg: '#0A0404',
    bg2: '#060202',
    accent: '#E02020',
    accentFade: '#F05030',
    text: '#C01818',
    muted: '#2A0808',
    border: '#200808',
    subtagline: 'THE GAUNTLET',
    gradStart: '#E02020',
    gradEnd: '#F05030',
    ctxColor: '#200808',
  },
  bridge: {
    name: 'The Bridge',
    label: "Today's bridge",
    bg: '#FAF5EE',
    bg2: '#FFFFFF',
    accent: '#7A9E78',
    accentFade: '#C8A060',
    text: '#3A4830',
    muted: '#A89878',
    border: '#EDE4D8',
    subtagline: 'THE BRIDGE',
    gradStart: '#7A9E78',
    gradEnd: '#C8A060',
    ctxColor: '#A89878',
  },
  horizon: {
    name: 'The Horizon',
    label: "Today's horizon",
    bg: '#060C18',
    bg2: '#040810',
    accent: '#4898D8',
    accentFade: '#88C8F0',
    text: '#4898D8',
    muted: '#183040',
    border: '#0E2034',
    subtagline: 'THE HORIZON',
    gradStart: '#4898D8',
    gradEnd: '#88C8F0',
    ctxColor: '#102030',
  },
};

type QuestionType = keyof typeof QUESTION_TYPES;

function ResonatingC({ type }: { type: QuestionType }) {
  const t = QUESTION_TYPES[type];
  const logoWidth = SCREEN_WIDTH - 48;
  return (
    <Svg width={logoWidth} height={44} viewBox="0 0 300 44">
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
      {/* All three arcs share centre point (22, 22) */}
      {/* Outer arc — radius 18, most faded */}
      <Path
        d="M22,4 A18,18 0 0 0 22,40"
        fill="none"
        stroke="url(#cg3)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Middle arc — radius 12 */}
      <Path
        d="M22,10 A12,12 0 0 0 22,34"
        fill="none"
        stroke="url(#cg2)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {/* Inner arc — radius 7, boldest */}
      <Path
        d="M22,15 A7,7 0 0 0 22,29"
        fill="none"
        stroke="url(#cg1)"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      {/* Wordmark */}
      <SvgText
        x="48"
        y="20"
        fontFamily="System"
        fontSize="13"
        fontWeight="300"
        fill={t.accent}
        letterSpacing={5}
      >
        CANDOR
      </SvgText>
      {/* Sub label */}
      <SvgText
        x="49"
        y="34"
        fontFamily="System"
        fontSize="7"
        fill={t.muted}
        letterSpacing={2}
      >
        {t.subtagline}
      </SvgText>
    </Svg>
  );
}

function RippleEffect({ accent, trigger }: { accent: string; trigger: number }) {
  const rings = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const opacities = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    if (trigger === 0) return;
    rings.forEach((r, i) => r.setValue(0));
    opacities.forEach((o) => o.setValue(0));

    rings.forEach((r, i) => {
      Animated.sequence([
        Animated.delay(i * 180),
        Animated.parallel([
          Animated.timing(r, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacities[i], {
              toValue: 0.35,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(opacities[i], {
              toValue: 0,
              duration: 900,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start();
    });
  }, [trigger]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {rings.map((r, i) => {
        const size = 100 + i * 60;
        const scale = r.interpolate({
          inputRange: [0, 1],
          outputRange: [0.2, 3.5],
        });
        return (
          <Animated.View
            key={i}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              borderRadius: size / 2,
              borderWidth: 1,
              borderColor: accent,
              top: '35%',
              left: '50%',
              marginLeft: -(size / 2),
              marginTop: -(size / 2),
              opacity: opacities[i],
              transform: [{ scale }],
            }}
          />
        );
      })}
    </View>
  );
}

export default function HomeScreen() {
  const [questionType, setQuestionType] = useState<QuestionType>('spark');
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [rippleTrigger, setRippleTrigger] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const t = QUESTION_TYPES[questionType];

  useEffect(() => {
    loadStreak();
    loadDailyQuestion();
  }, []);

  function triggerTransition(newType: QuestionType) {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    setRippleTrigger((n) => n + 1);
    setQuestionType(newType);
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

  async function loadDailyQuestion() {
    const today = new Date().toDateString();
    const cachedDate = await AsyncStorage.getItem('questionDate');
    const cachedQuestion = await AsyncStorage.getItem('questionText');
    const cachedContext = await AsyncStorage.getItem('questionContext');
    const cachedType = (await AsyncStorage.getItem('questionType')) as QuestionType | null;

    if (cachedDate === today && cachedQuestion) {
      setQuestion(cachedQuestion);
      setContext(cachedContext || '');
      if (cachedType && QUESTION_TYPES[cachedType]) {
        triggerTransition(cachedType);
      }
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
          max_tokens: 400,
          messages: [{
            role: 'user',
            content: `You are Candor. Today is ${dateStr}. Generate the daily question for coworkers.

Choose ONE question type:
- spark: high energy, reclaims curiosity, makes someone feel alive
- mirror: low energy, internal truth, requires silence before answering
- gauntlet: highest energy, breaks stagnation, slightly uncomfortable
- bridge: medium energy, authentic connection, vulnerability between people
- horizon: medium-high energy, future clarity, forward-looking

The question must replace "how are you?" in a morning coworker interaction. One direct sentence, no preamble.

Respond ONLY as JSON, no markdown:
{"type": "spark|mirror|gauntlet|bridge|horizon", "question": "the question", "context": "one line on why this matters — max 12 words"}`,
          }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
      const newType = (parsed.type as QuestionType) || 'bridge';

      await AsyncStorage.setItem('questionDate', today);
      await AsyncStorage.setItem('questionText', parsed.question);
      await AsyncStorage.setItem('questionContext', parsed.context || '');
      await AsyncStorage.setItem('questionType', newType);

      triggerTransition(newType);
      setQuestion(parsed.question);
      setContext(parsed.context || '');
    } catch {
      setQuestion('What would you do differently if you started this job over?');
      setContext('The answer reveals what actually matters to someone.');
      triggerTransition('bridge');
    }
    setLoading(false);
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  return (
    <View style={[styles.root, { backgroundColor: t.bg }]}>
      <RippleEffect accent={t.accent} trigger={rippleTrigger} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fadeAnim }}>

          <View style={styles.logoWrap}>
            <ResonatingC type={questionType} />
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
              <View
                key={i}
                style={[
                  styles.tick,
                  v === 1
                    ? { backgroundColor: t.accent }
                    : v === 0.5
                    ? { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: t.accent }
                    : { backgroundColor: t.border },
                ]}
              />
            ))}
          </View>

          <Text style={[styles.dateLabel, { color: t.muted }]}>{today}</Text>

          <View style={[styles.card, {
            backgroundColor: t.bg2,
            borderColor: t.border,
            borderLeftColor: t.accent,
          }]}>
            <View style={styles.cardTop}>
              <Text style={[styles.cardEyebrow, { color: t.muted }]}>{t.label}</Text>
              <View style={[styles.typePill, { borderColor: t.border }]}>
                <Text style={[styles.typePillText, { color: t.accent }]}>{t.name}</Text>
              </View>
            </View>
            {loading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color={t.accent} size="small" />
                <Text style={[styles.loadingText, { color: t.muted }]}>
                  Finding today's question…
                </Text>
              </View>
            ) : (
              <>
                <Text style={[styles.questionText, { color: t.text }]}>
                  {`"${question}"`}
                </Text>
                <View style={[styles.cardDivider, { backgroundColor: t.border }]} />
                <Text style={[styles.contextText, { color: t.ctxColor }]}>{context}</Text>
              </>
            )}
          </View>

          <View style={[styles.methodCard, {
            backgroundColor: t.bg2,
            borderColor: t.border,
          }]}>
            <Text style={[styles.methodTitle, { color: t.muted }]}>The method</Text>
            <Text style={[styles.methodBody, { color: t.muted }]}>
              Tomorrow morning, skip the small talk. Walk up to someone and ask this instead. Then actually listen.
            </Text>
          </View>

          {todayDone && (
            <View style={[styles.doneRow, { borderColor: t.border }]}>
              <Text style={[styles.doneText, { color: t.accent }]}>
                ✦ You showed up today. See you tomorrow.
              </Text>
            </View>
          )}

        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { padding: 24, paddingTop: 64, paddingBottom: 48 },
  logoWrap: { marginBottom: 18 },
  divider: { height: 1, marginBottom: 22 },
  orrerySection: { alignItems: 'center', marginBottom: 8 },
  orrery: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  orreryInner: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  orreryNum: { fontSize: 24, fontWeight: '300', zIndex: 1 },
  orreryLabel: {
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 6,
    marginBottom: 18,
  },
  tickRow: {
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    marginBottom: 20,
  },
  tick: { width: 6, height: 14, borderRadius: 1 },
  dateLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 3,
    padding: 20,
    marginBottom: 14,
    minHeight: 120,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardEyebrow: { fontSize: 9, letterSpacing: 1.5, textTransform: 'uppercase' },
  typePill: {
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  typePillText: { fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 60,
  },
  loadingText: { fontSize: 14, fontStyle: 'italic' },
  questionText: {
    fontSize: 20,
    lineHeight: 30,
    fontStyle: 'italic',
    fontWeight: '300',
    marginBottom: 16,
  },
  cardDivider: { height: 1, marginBottom: 12 },
  contextText: { fontSize: 12, lineHeight: 18, fontStyle: 'italic' },
  methodCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 14,
  },
  methodTitle: {
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  methodBody: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  doneRow: {
    borderTopWidth: 1,
    paddingTop: 14,
    alignItems: 'center',
  },
  doneText: { fontSize: 12, letterSpacing: 0.5 },
});