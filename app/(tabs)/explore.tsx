import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

const CATEGORIES = [
  { name: 'Hot Take', emoji: '🔥', description: 'Bold observations about work and life', free: true },
  { name: 'Fun Fact', emoji: '💡', description: 'Surprising facts that make people think', free: true },
  { name: 'Hypothetical', emoji: '🌀', description: 'What-ifs that reveal who someone really is', free: true },
  { name: 'This or That', emoji: '⚖️', description: 'Quick choices that spark debate', free: false },
  { name: 'Nostalgia', emoji: '📼', description: 'Shared memories that bring people together', free: false },
  { name: 'Would You Rather', emoji: '🎲', description: 'Impossible choices, real conversations', free: false },
  { name: 'Brain Teaser', emoji: '🧩', description: 'Puzzles that get everyone thinking', free: false },
  { name: 'Debate Club', emoji: '🎙️', description: 'Topics worth arguing about', free: false },
  { name: 'Pop Culture', emoji: '🎬', description: 'Movies, music, moments we all share', free: false },
  { name: 'Custom', emoji: '✏️', description: 'Your own categories, your own voice', free: false },
];

export default function CategoriesScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      <View style={styles.header}>
        <Text style={styles.logo}>can<Text style={styles.logoItalic}>dor</Text></Text>
      </View>

      <Text style={styles.sectionLabel}>Free</Text>
      {CATEGORIES.filter(c => c.free).map((cat) => (
        <View key={cat.name} style={styles.card}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <View style={styles.cardBody}>
            <Text style={styles.catName}>{cat.name}</Text>
            <Text style={styles.catDesc}>{cat.description}</Text>
          </View>
          <View style={styles.activeBadge}>
            <Text style={styles.activeBadgeText}>Active</Text>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Pro</Text>
      {CATEGORIES.filter(c => !c.free).map((cat) => (
        <View key={cat.name} style={[styles.card, styles.cardLocked]}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <View style={styles.cardBody}>
            <Text style={[styles.catName, styles.lockedText]}>{cat.name}</Text>
            <Text style={[styles.catDesc, styles.lockedText]}>{cat.description}</Text>
          </View>
          <View style={styles.lockBadge}>
            <Text style={styles.lockBadgeText}>🔒</Text>
          </View>
        </View>
      ))}

      <View style={styles.upgradeCard}>
        <Text style={styles.upgradeTitle}>Unlock everything</Text>
        <Text style={styles.upgradeDesc}>
          Get all 10 categories, unlimited conversations, team sharing, and Slack integration.
        </Text>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade to Pro — $4/month</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDFAF7' },
  content: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { marginBottom: 32 },
  logo: { fontSize: 28, fontWeight: '700', color: '#2C2018', letterSpacing: -0.5 },
  logoItalic: { fontStyle: 'italic', fontWeight: '400' },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', color: '#A89080', marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 0.5, borderColor: '#E8DDD5' },
  cardLocked: { opacity: 0.5 },
  cardBody: { flex: 1, marginLeft: 12 },
  emoji: { fontSize: 24 },
  catName: { fontSize: 15, fontWeight: '600', color: '#2C2018', marginBottom: 2 },
  catDesc: { fontSize: 13, color: '#A89080', lineHeight: 18 },
  lockedText: { color: '#A89080' },
  activeBadge: { backgroundColor: '#EAF3DE', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  activeBadgeText: { fontSize: 11, color: '#27500A', fontWeight: '600' },
  lockBadge: { padding: 4 },
  lockBadgeText: { fontSize: 16 },
  upgradeCard: { backgroundColor: '#4A3728', borderRadius: 12, padding: 24, marginTop: 24 },
  upgradeTitle: { fontSize: 18, fontWeight: '700', color: '#FDFAF7', marginBottom: 8 },
  upgradeDesc: { fontSize: 14, color: '#C4A882', lineHeight: 20, marginBottom: 20 },
  upgradeButton: { backgroundColor: '#FDFAF7', borderRadius: 8, padding: 14, alignItems: 'center' },
  upgradeButtonText: { fontSize: 14, fontWeight: '700', color: '#4A3728' },
});