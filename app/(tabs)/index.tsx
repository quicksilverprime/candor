import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const CATEGORIES = ['Hot Take', 'Fun Fact', 'Hypothetical'];

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState('Hot Take');
  const [cardText, setCardText] = useState(
    '"If every meeting that could have been an email actually became one, we\'d all leave work two hours earlier — and not one decision would change."'
  );
  const [tip, setTip] = useState('Say it at standup. Watch who laughs and who doesn\'t.');
  const [loading, setLoading] = useState(false);

  async function getNewConversation(category: string) {
    setLoading(true);
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
          max_tokens: 300,
          messages: [{
            role: 'user',
            content: `You are Candor — an app that helps people have honest, real conversations at work. Generate ONE conversation starter for the category: "${category}".

Rules:
- Feel like something a real, grounded person would say
- Max 2 sentences. No fluff.
- For "Hot Take": a confident real observation about work or life
- For "Fun Fact": a genuinely surprising fact that makes someone think
- For "Hypothetical": a meaningful what-if that reveals something about a person

Respond ONLY as JSON, no markdown:
{"text": "the conversation starter", "tip": "one honest tip on when to use it — max 12 words"}`
          }],
        }),
      });
      const data = await response.json();
      const raw = data.content?.[0]?.text || '{}';
      const parsed = JSON.parse(raw);
      setCardText(`"${parsed.text}"`);
      setTip(parsed.tip || '');
    } catch {
      setCardText('"Something went wrong. Try again."');
    }
    setLoading(false);
  }

  function selectCategory(cat: string) {
    setActiveCategory(cat);
    getNewConversation(cat);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <Text style={styles.logo}>can<Text style={styles.logoItalic}>dor</Text></Text>
        <View style={styles.planBadge}>
          <Text style={styles.planText}>Free</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Today's conversation</Text>

      <View style={styles.card}>
        <Text style={styles.categoryLabel}>{activeCategory}</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color="#7A5C48" />
            <Text style={styles.loadingText}>Finding the right words…</Text>
          </View>
        ) : (
          <Text style={styles.cardText}>{cardText}</Text>
        )}
        <View style={styles.cardDivider} />
        <Text style={styles.tipText}>{tip}</Text>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => getNewConversation(activeCategory)}
          disabled={loading}>
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionLabel}>Categories</Text>
      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.catButton, activeCategory === cat && styles.catButtonActive]}
            onPress={() => selectCategory(cat)}>
            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFAF7' },
  content: { padding: 24, paddingTop: 60 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  logo: { fontSize: 28, fontWeight: '700', color: '#2C2018', letterSpacing: -0.5 },
  logoItalic: { fontStyle: 'italic', fontWeight: '400' },
  planBadge: { backgroundColor: '#EDE8E3', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4 },
  planText: { fontSize: 11, color: '#7A5C48', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#A89080', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 24, marginBottom: 32, borderWidth: 0.5, borderColor: '#E8DDD5' },
  categoryLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: '#7A5C48', marginBottom: 16 },
  cardText: { fontSize: 20, lineHeight: 30, color: '#2C2018', fontStyle: 'italic', marginBottom: 20 },
  loadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20, minHeight: 60 },
  loadingText: { fontSize: 15, color: '#A89080', fontStyle: 'italic' },
  cardDivider: { height: 0.5, backgroundColor: '#E8DDD5', marginBottom: 14 },
  tipText: { fontSize: 13, color: '#A89080', lineHeight: 20, marginBottom: 16 },
  newButton: { alignSelf: 'flex-end', backgroundColor: '#4A3728', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 8 },
  newButtonText: { color: '#FDFAF7', fontSize: 13, fontWeight: '600' },
  categories: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 0.5, borderColor: '#E8DDD5', backgroundColor: '#F5F0EB' },
  catButtonActive: { backgroundColor: '#4A3728', borderColor: '#4A3728' },
  catText: { fontSize: 13, color: '#7A5C48', fontWeight: '500' },
  catTextActive: { color: '#FDFAF7' },
});