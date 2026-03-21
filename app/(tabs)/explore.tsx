import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const CATEGORIES = [
  {
    id: 'coworker',
    name: 'Coworker Daily',
    emoji: '◈',
    desc: 'The original. One question every morning.',
    free: true,
    accent: '#7A9E78',
    accentFade: '#C8A060',
    bg: '#FAF5EE',
    bg2: '#FFFFFF',
    text: '#3A4830',
    muted: '#A89878',
    border: '#EDE4D8',
    prompt: 'Generate a thought-provoking question for coworkers that replaces "how are you?" in a morning interaction. It should be direct, real, and slightly uncomfortable in a good way.',
  },
  {
    id: 'family',
    name: 'Family Dinner',
    emoji: '⌂',
    desc: 'No phones. Real conversation. Any age.',
    free: true,
    accent: '#C07840',
    accentFade: '#E8A060',
    bg: '#FBF5EC',
    bg2: '#FFFFFF',
    text: '#3D2010',
    muted: '#C0A070',
    border: '#E8D4B0',
    prompt: 'Generate a warm, multigenerational question for a family dinner table. It should work for ages 8 to 80, spark storytelling, and get everyone off their phones.',
  },
  {
    id: 'closefriend',
    name: 'Close Friend',
    emoji: '◎',
    desc: 'For the people who already know you.',
    free: true,
    accent: '#6878C8',
    accentFade: '#A8B0E8',
    bg: '#F0F0FC',
    bg2: '#FFFFFF',
    text: '#283068',
    muted: '#8890C0',
    border: '#D0D4F0',
    prompt: 'Generate a personal, slightly vulnerable question for close friends. It should go deeper than small talk and reveal something real about who someone is.',
  },
  {
    id: 'spicy',
    name: 'Spicy 🌶',
    emoji: '◉',
    desc: 'Riskier questions. Like a card game but better.',
    free: false,
    accent: '#E04828',
    accentFade: '#F08050',
    bg: '#0E0604',
    bg2: '#180A06',
    text: '#E04828',
    muted: '#3A1808',
    border: '#2A1008',
    prompt: 'Generate a spicy, bold question that is fun and slightly risky — like a card game. It should be daring but not offensive, the kind of question that makes people gasp then laugh.',
  },
  {
    id: 'firstdate',
    name: 'First Date',
    emoji: '◌',
    desc: 'Light, curious, and surprisingly revealing.',
    free: false,
    accent: '#D87898',
    accentFade: '#F0A8B8',
    bg: '#FDF0F4',
    bg2: '#FFFFFF',
    text: '#682840',
    muted: '#C090A0',
    border: '#F0D0D8',
    prompt: 'Generate a first date question that feels light and playful but reveals something real about a person. It should create genuine curiosity and make both people lean in.',
  },
  {
    id: 'thousandthdate',
    name: 'Thousandth Date',
    emoji: '●',
    desc: 'For people who think they know each other.',
    free: false,
    accent: '#8858A8',
    accentFade: '#B890D0',
    bg: '#0C0814',
    bg2: '#140C20',
    text: '#C098E0',
    muted: '#3A2850',
    border: '#281840',
    prompt: 'Generate a deep, honest question for long-term partners. It should reveal something they have never talked about despite years together — the kind of question that opens a new room in someone you thought you knew completely.',
  },
  {
    id: 'onboarding',
    name: 'Work Onboarding',
    emoji: '⊕',
    desc: 'The most interesting onboarding questions ever written.',
    free: false,
    accent: '#20A8C0',
    accentFade: '#60D0E0',
    bg: '#040C10',
    bg2: '#081418',
    text: '#20A8C0',
    muted: '#103840',
    border: '#0C2830',
    prompt: 'Generate a brilliant work onboarding question that reveals a new hire\'s working style, values, and personality without feeling like HR. It should be creative, slightly unexpected, and make the whole team want to answer it too.',
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia',
    emoji: '◷',
    desc: 'Memory-driven. Story-first.',
    free: false,
    accent: '#A07840',
    accentFade: '#D0A868',
    bg: '#FAF0E0',
    bg2: '#FFFFFF',
    text: '#3A2808',
    muted: '#B09058',
    border: '#E8D4A8',
    prompt: 'Generate a nostalgia question that brings up a specific memory and invites storytelling. It should feel warm and evocative, the kind of question that makes someone smile before they even answer.',
  },
  {
    id: 'brainteaser',
    name: 'Brain Teaser',
    emoji: '⟳',
    desc: 'Puzzles that get everyone thinking.',
    free: false,
    accent: '#38B878',
    accentFade: '#70D8A0',
    bg: '#040E08',
    bg2: '#081408',
    text: '#38B878',
    muted: '#103820',
    border: '#0C2818',
    prompt: 'Generate a creative brain teaser or lateral thinking puzzle that works as a conversation starter. It should be solvable but not obvious, and spark group discussion.',
  },
  {
    id: 'debate',
    name: 'Debate Club',
    emoji: '⟁',
    desc: 'Topics worth arguing about.',
    free: false,
    accent: '#C8A020',
    accentFade: '#E8C848',
    bg: '#0A0800',
    bg2: '#100E00',
    text: '#C8A020',
    muted: '#302800',
    border: '#201C00',
    prompt: 'Generate a debate question that has two genuinely defensible sides. It should be thought-provoking and slightly controversial but not politically divisive — the kind of question where reasonable people strongly disagree.',
  },
  {
    id: 'custom',
    name: 'Custom',
    emoji: '✎',
    desc: 'Your own categories. Your own voice.',
    free: false,
    accent: '#9898A8',
    accentFade: '#C0C0C8',
    bg: '#F4F4F8',
    bg2: '#FFFFFF',
    text: '#383848',
    muted: '#9898A8',
    border: '#D8D8E0',
    prompt: '',
  },
];

type Category = typeof CATEGORIES[0];

function ResonatingCMini({ cat }: { cat: Category }) {
  return (
    <Svg width={32} height={32} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id={`lg1-${cat.id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={cat.accent} />
          <Stop offset="100%" stopColor={cat.accentFade} />
        </LinearGradient>
        <LinearGradient id={`lg2-${cat.id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={cat.accent} stopOpacity="0.5" />
          <Stop offset="100%" stopColor={cat.accentFade} stopOpacity="0.2" />
        </LinearGradient>
        <LinearGradient id={`lg3-${cat.id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0%" stopColor={cat.accent} stopOpacity="0.25" />
          <Stop offset="100%" stopColor={cat.accentFade} stopOpacity="0.1" />
        </LinearGradient>
      </Defs>
      <Path d="M16,2 A14,14 0 0 0 16,30" fill="none" stroke={`url(#lg3-${cat.id})`} strokeWidth="3" strokeLinecap="round" />
      <Path d="M16,7 A9,9 0 0 0 16,25" fill="none" stroke={`url(#lg2-${cat.id})`} strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M16,11 A5,5 0 0 0 16,21" fill="none" stroke={`url(#lg1-${cat.id})`} strokeWidth="4" strokeLinecap="round" />
    </Svg>
  );
}

function QuestionModal({
  cat,
  visible,
  onClose,
}: {
  cat: Category | null;
  visible: boolean;
  onClose: () => void;
}) {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [questionType, setQuestionType] = useState('');
  const [loading, setLoading] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (visible && cat) {
      checkUsageAndLoad();
    } else {
      setQuestion('');
      setContext('');
      setShowPaywall(false);
    }
  }, [visible, cat]);

  async function checkUsageAndLoad() {
    if (!cat) return;
    const today = new Date().toDateString();
    const usedKey = `cat_used_${cat.id}_${today}`;
    const countKey = `cat_total_${cat.id}`;
    const alreadyUsedToday = await AsyncStorage.getItem(usedKey);
    const totalStr = await AsyncStorage.getItem(countKey);
    const total = parseInt(totalStr || '0');
    setUsageCount(total);

    if (alreadyUsedToday) {
      setShowPaywall(false);
      const cached = await AsyncStorage.getItem(`cat_q_${cat.id}_${today}`);
      const cachedCtx = await AsyncStorage.getItem(`cat_ctx_${cat.id}_${today}`);
      const cachedType = await AsyncStorage.getItem(`cat_type_${cat.id}_${today}`);
      if (cached) {
        setQuestion(cached);
        setContext(cachedCtx || '');
        setQuestionType(cachedType || '');
        return;
      }
    }

    if (!cat.free && total >= 5) {
      setShowPaywall(true);
      return;
    }

    await fetchQuestion(cat, today, total);
  }

  async function fetchQuestion(cat: Category, today: string, currentTotal: number) {
    setLoading(true);
    setShowPaywall(false);
    try {
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
            content: `You are Candor. ${cat.prompt}

Also assign a question type:
- spark: high energy, curiosity
- mirror: low energy, internal truth
- gauntlet: confrontational, breaks stagnation
- bridge: connection, vulnerability
- horizon: future-focused, expansive

Respond ONLY as JSON:
{"type": "spark|mirror|gauntlet|bridge|horizon", "question": "the question", "context": "one line why this matters — max 12 words"}`,
          }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());

      const newTotal = currentTotal + 1;
      await AsyncStorage.setItem(`cat_used_${cat.id}_${today}`, 'true');
      await AsyncStorage.setItem(`cat_total_${cat.id}`, String(newTotal));
      await AsyncStorage.setItem(`cat_q_${cat.id}_${today}`, parsed.question);
      await AsyncStorage.setItem(`cat_ctx_${cat.id}_${today}`, parsed.context || '');
      await AsyncStorage.setItem(`cat_type_${cat.id}_${today}`, parsed.type || '');

      setQuestion(parsed.question);
      setContext(parsed.context || '');
      setQuestionType(parsed.type || '');
      setUsageCount(newTotal);
    } catch {
      setQuestion('Something went wrong. Try again.');
    }
    setLoading(false);
  }

  if (!cat) return null;

  const remaining = Math.max(0, 5 - usageCount);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[mStyles.root, { backgroundColor: cat.bg }]}>
        <View style={mStyles.handle} />

        <ScrollView contentContainerStyle={mStyles.content}>
          <View style={mStyles.header}>
            <ResonatingCMini cat={cat} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[mStyles.catName, { color: cat.text }]}>{cat.name}</Text>
              <Text style={[mStyles.catDesc, { color: cat.muted }]}>{cat.desc}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={mStyles.closeBtn}>
              <Text style={[mStyles.closeText, { color: cat.muted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={[mStyles.divider, { backgroundColor: cat.border }]} />

          {showPaywall ? (
            <View style={mStyles.paywallWrap}>
              <Text style={[mStyles.paywallTitle, { color: cat.accent }]}>
                You've used your 5 free questions
              </Text>
              <Text style={[mStyles.paywallSub, { color: cat.muted }]}>
                Upgrade to Pro for unlimited questions in every category — one per day, every day.
              </Text>
              <TouchableOpacity style={[mStyles.proBtn, { backgroundColor: cat.accent }]}>
                <Text style={mStyles.proBtnText}>Upgrade to Pro — $4/month</Text>
              </TouchableOpacity>
              <Text style={[mStyles.paywallFine, { color: cat.muted }]}>
                7-day free trial. Cancel anytime.
              </Text>
            </View>
          ) : loading ? (
            <View style={mStyles.loadingWrap}>
              <ActivityIndicator color={cat.accent} />
              <Text style={[mStyles.loadingText, { color: cat.muted }]}>
                Finding today's question…
              </Text>
            </View>
          ) : (
            <>
              {questionType ? (
                <View style={[mStyles.typePill, { borderColor: cat.border }]}>
                  <Text style={[mStyles.typePillText, { color: cat.accent }]}>
                    {questionType.toUpperCase()}
                  </Text>
                </View>
              ) : null}

              <Text style={[mStyles.question, { color: cat.text }]}>
                {`"${question}"`}
              </Text>

              <View style={[mStyles.divider, { backgroundColor: cat.border }]} />

              <Text style={[mStyles.context, { color: cat.muted }]}>{context}</Text>

              {!cat.free && (
                <View style={[mStyles.usageBar, { borderColor: cat.border }]}>
                  <Text style={[mStyles.usageText, { color: cat.muted }]}>
                    {remaining > 0
                      ? `${remaining} free question${remaining === 1 ? '' : 's'} remaining in this category`
                      : 'Last free question used — upgrade for unlimited'}
                  </Text>
                  <View style={[mStyles.usageTrack, { backgroundColor: cat.border }]}>
                    <View style={[mStyles.usageFill, {
                      backgroundColor: cat.accent,
                      width: `${(usageCount / 5) * 100}%`,
                    }]} />
                  </View>
                </View>
              )}

              <View style={[mStyles.methodCard, { backgroundColor: cat.bg2, borderColor: cat.border }]}>
                <Text style={[mStyles.methodTitle, { color: cat.muted }]}>The method</Text>
                <Text style={[mStyles.methodBody, { color: cat.muted }]}>
                  Put the phone down. Ask this. Then actually listen to the answer.
                </Text>
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

export default function CategoriesScreen() {
  const [selected, setSelected] = useState<Category | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function openCategory(cat: Category) {
    setSelected(cat);
    setModalVisible(true);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <Text style={styles.logo}>
          can<Text style={styles.logoItalic}>dor</Text>
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Free</Text>
      {CATEGORIES.filter(c => c.free).map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.catCard, { backgroundColor: cat.bg2, borderColor: cat.border }]}
          onPress={() => openCategory(cat)}
        >
          <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
            <ResonatingCMini cat={cat} />
          </View>
          <View style={styles.catBody}>
            <Text style={[styles.catName, { color: cat.text }]}>{cat.name}</Text>
            <Text style={[styles.catDesc, { color: cat.muted }]}>{cat.desc}</Text>
          </View>
          <Text style={[styles.catArrow, { color: cat.muted }]}>›</Text>
        </TouchableOpacity>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Pro</Text>
      {CATEGORIES.filter(c => !c.free).map(cat => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.catCard, { backgroundColor: cat.bg2 || '#FAFAFA', borderColor: cat.border }]}
          onPress={() => openCategory(cat)}
        >
          <View style={[styles.catIcon, { backgroundColor: cat.bg }]}>
            <ResonatingCMini cat={cat} />
          </View>
          <View style={styles.catBody}>
            <View style={styles.catNameRow}>
              <Text style={[styles.catName, { color: cat.text }]}>{cat.name}</Text>
              <View style={styles.proBadge}>
                <Text style={styles.proBadgeText}>5 free</Text>
              </View>
            </View>
            <Text style={[styles.catDesc, { color: cat.muted }]}>{cat.desc}</Text>
          </View>
          <Text style={[styles.catArrow, { color: cat.muted }]}>›</Text>
        </TouchableOpacity>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF5EE' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 48 },
  header: { marginBottom: 28 },
  logo: { fontSize: 28, fontWeight: '700', color: '#2C2018', letterSpacing: -0.5 },
  logoItalic: { fontStyle: 'italic', fontWeight: '400' },
  sectionLabel: {
    fontSize: 10, fontWeight: '600', letterSpacing: 1.2,
    textTransform: 'uppercase', color: '#A89878', marginBottom: 12,
  },
  catCard: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 12, borderWidth: 0.5,
    padding: 14, marginBottom: 10, gap: 14,
  },
  catIcon: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  catBody: { flex: 1 },
  catNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 3 },
  catName: { fontSize: 15, fontWeight: '500' },
  catDesc: { fontSize: 12, lineHeight: 18 },
  catArrow: { fontSize: 20, fontWeight: '300' },
  proBadge: {
    backgroundColor: '#EDE4D8', borderRadius: 4,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  proBadgeText: { fontSize: 9, color: '#A89878', fontWeight: '600', letterSpacing: 0.5 },
});

const mStyles = StyleSheet.create({
  root: { flex: 1 },
  handle: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: '#C8C4BC', alignSelf: 'center', marginTop: 12, marginBottom: 4,
  },
  content: { padding: 24, paddingBottom: 48 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  catName: { fontSize: 17, fontWeight: '500', marginBottom: 2 },
  catDesc: { fontSize: 12, lineHeight: 18 },
  closeBtn: { padding: 8 },
  closeText: { fontSize: 16 },
  divider: { height: 1, marginBottom: 20 },
  typePill: {
    borderWidth: 1, borderRadius: 3,
    paddingHorizontal: 8, paddingVertical: 3,
    alignSelf: 'flex-start', marginBottom: 14,
  },
  typePillText: { fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' },
  question: {
    fontSize: 22, lineHeight: 32,
    fontStyle: 'italic', fontWeight: '300', marginBottom: 20,
  },
  context: { fontSize: 13, lineHeight: 20, fontStyle: 'italic', marginBottom: 20 },
  loadingWrap: { alignItems: 'center', paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 14, fontStyle: 'italic' },
  usageBar: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  usageText: { fontSize: 11, marginBottom: 8, lineHeight: 16 },
  usageTrack: { height: 3, borderRadius: 2, overflow: 'hidden' },
  usageFill: { height: '100%', borderRadius: 2 },
  methodCard: { borderRadius: 10, borderWidth: 1, padding: 16 },
  methodTitle: {
    fontSize: 9, letterSpacing: 1.2,
    textTransform: 'uppercase', marginBottom: 6,
  },
  methodBody: { fontSize: 13, lineHeight: 20, fontStyle: 'italic' },
  paywallWrap: { paddingVertical: 32, alignItems: 'center', gap: 16 },
  paywallTitle: { fontSize: 20, fontWeight: '300', textAlign: 'center', letterSpacing: -0.3 },
  paywallSub: { fontSize: 14, lineHeight: 22, textAlign: 'center', fontStyle: 'italic' },
  proBtn: {
    borderRadius: 10, padding: 16,
    alignItems: 'center', width: '100%', marginTop: 8,
  },
  proBtnText: { fontSize: 14, color: '#FAF5EE', fontWeight: '600' },
  paywallFine: { fontSize: 11, fontStyle: 'italic' },
});