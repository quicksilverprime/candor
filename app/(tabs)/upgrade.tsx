import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Linking,
  } from 'react-native';
  import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
  
  const FEATURES_FREE = [
    'One question every day',
    'The Bridge question type',
    'Day streak tracking',
    'Morning push notification',
  ];
  
  const FEATURES_PRO = [
    'All five question types',
    'The Gauntlet — our most confrontational',
    'The Spark — high energy curiosity',
    'The Mirror — deep internal truth',
    'The Horizon — future clarity',
    'Slack & Teams integration',
    'Team sharing (up to 10)',
    'Saved question history',
    'Custom question categories',
    'Early access to new types',
  ];
  
  function ResonatingCSmall() {
    return (
      <Svg width={120} height={32} viewBox="0 0 120 32">
        <Defs>
          <LinearGradient id="pg1" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#7A9E78" />
            <Stop offset="100%" stopColor="#C8A060" />
          </LinearGradient>
          <LinearGradient id="pg2" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#7A9E78" stopOpacity="0.5" />
            <Stop offset="100%" stopColor="#C8A060" stopOpacity="0.2" />
          </LinearGradient>
          <LinearGradient id="pg3" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0%" stopColor="#7A9E78" stopOpacity="0.25" />
            <Stop offset="100%" stopColor="#C8A060" stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        <Path d="M16,2 A14,14 0 0 0 16,30" fill="none" stroke="url(#pg3)" strokeWidth="3" strokeLinecap="round" />
        <Path d="M16,7 A9,9 0 0 0 16,25" fill="none" stroke="url(#pg2)" strokeWidth="3.5" strokeLinecap="round" />
        <Path d="M16,11 A5,5 0 0 0 16,21" fill="none" stroke="url(#pg1)" strokeWidth="4" strokeLinecap="round" />
      </Svg>
    );
  }
  
  export default function UpgradeScreen() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
  
        <View style={styles.header}>
          <ResonatingCSmall />
          <Text style={styles.headerTitle}>Go deeper with Pro</Text>
          <Text style={styles.headerSub}>
            The free tier gives you one question type. Pro unlocks the full refractive system — five lenses, five emotional contracts, one each morning.
          </Text>
        </View>
  
        <View style={styles.plansRow}>
  
          {/* Free plan */}
          <View style={styles.planCard}>
            <Text style={styles.planName}>Free</Text>
            <Text style={styles.planPrice}>$0<Text style={styles.planPer}> / mo</Text></Text>
            <View style={styles.divider} />
            {FEATURES_FREE.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
            <View style={[styles.planBtn, styles.planBtnGhost]}>
              <Text style={styles.planBtnGhostText}>Current plan</Text>
            </View>
          </View>
  
          {/* Pro plan */}
          <View style={[styles.planCard, styles.planCardFeatured]}>
            <View style={styles.popularBadge}>
              <Text style={styles.popularText}>Most popular</Text>
            </View>
            <Text style={[styles.planName, { color: '#FAF5EE' }]}>Pro</Text>
            <Text style={[styles.planPrice, { color: '#C8A060' }]}>
              $4<Text style={[styles.planPer, { color: '#7A6040' }]}> / mo</Text>
            </Text>
            <View style={[styles.divider, { backgroundColor: '#2A3828' }]} />
            {FEATURES_PRO.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={[styles.featureCheck, { color: '#7A9E78' }]}>✦</Text>
                <Text style={[styles.featureText, { color: '#A8B898' }]}>{f}</Text>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.planBtn, styles.planBtnFilled]}
              onPress={() => Linking.openURL('https://candor.app/pro')}
            >
              <Text style={styles.planBtnFilledText}>Upgrade to Pro</Text>
            </TouchableOpacity>
          </View>
  
        </View>
  
        {/* Question type preview */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>What you unlock</Text>
  
          {[
            { name: 'The Spark', color: '#F0C020', bg: '#09060E', desc: 'High energy · Reclaims curiosity' },
            { name: 'The Mirror', color: '#4A4840', bg: '#E8E6E0', desc: 'Low energy · Internal truth' },
            { name: 'The Gauntlet', color: '#E02020', bg: '#0A0404', desc: 'High energy · Breaks stagnation' },
            { name: 'The Horizon', color: '#4898D8', bg: '#060C18', desc: 'Med-high energy · Future clarity' },
          ].map((qt) => (
            <View key={qt.name} style={[styles.qtCard, { backgroundColor: qt.bg }]}>
              <View style={[styles.qtDot, { backgroundColor: qt.color }]} />
              <View style={styles.qtBody}>
                <Text style={[styles.qtName, { color: qt.color }]}>{qt.name}</Text>
                <Text style={[styles.qtDesc, { color: qt.color, opacity: 0.5 }]}>{qt.desc}</Text>
              </View>
              <View style={styles.lockBadge}>
                <Text style={styles.lockText}>Pro</Text>
              </View>
            </View>
          ))}
        </View>
  
        {/* Team plan teaser */}
        <View style={styles.teamCard}>
          <Text style={styles.teamTitle}>Running a team?</Text>
          <Text style={styles.teamBody}>
            Team plans start at $15/month for up to 10 people. One manager, one question, ten real conversations every morning.
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://candor.app/teams')}
          >
            <Text style={styles.teamLink}>Learn about team plans →</Text>
          </TouchableOpacity>
        </View>
  
        <Text style={styles.fine}>
          Cancel anytime. Billed monthly. 7-day free trial on Pro.
        </Text>
  
      </ScrollView>
    );
  }
  
  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FAF5EE' },
    content: { padding: 24, paddingTop: 60, paddingBottom: 48 },
    header: { marginBottom: 28 },
    headerTitle: {
      fontSize: 26,
      fontWeight: '300',
      color: '#3A4830',
      marginTop: 16,
      marginBottom: 10,
      letterSpacing: -0.5,
    },
    headerSub: {
      fontSize: 14,
      color: '#A89878',
      lineHeight: 22,
      fontStyle: 'italic',
    },
    plansRow: { gap: 14, marginBottom: 32 },
    planCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: 14,
      borderWidth: 1,
      borderColor: '#EDE4D8',
      padding: 20,
    },
    planCardFeatured: {
      backgroundColor: '#1A2818',
      borderColor: '#7A9E78',
      borderWidth: 1.5,
    },
    popularBadge: {
      backgroundColor: '#7A9E78',
      borderRadius: 4,
      paddingHorizontal: 10,
      paddingVertical: 4,
      alignSelf: 'flex-start',
      marginBottom: 12,
    },
    popularText: {
      fontSize: 9,
      fontWeight: '600',
      color: '#FAF5EE',
      letterSpacing: 1,
      textTransform: 'uppercase',
    },
    planName: {
      fontSize: 20,
      fontWeight: '300',
      color: '#3A4830',
      marginBottom: 4,
      letterSpacing: 1,
    },
    planPrice: {
      fontSize: 32,
      fontWeight: '300',
      color: '#3A4830',
      marginBottom: 16,
    },
    planPer: { fontSize: 14, color: '#A89878' },
    divider: { height: 1, backgroundColor: '#EDE4D8', marginBottom: 16 },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      marginBottom: 10,
    },
    featureCheck: { fontSize: 13, color: '#7A9E78', marginTop: 1 },
    featureText: { fontSize: 13, color: '#5A6848', lineHeight: 20, flex: 1 },
    planBtn: {
      borderRadius: 8,
      padding: 14,
      alignItems: 'center',
      marginTop: 16,
    },
    planBtnGhost: {
      borderWidth: 1,
      borderColor: '#EDE4D8',
      backgroundColor: 'transparent',
    },
    planBtnGhostText: { fontSize: 13, color: '#A89878', fontWeight: '500' },
    planBtnFilled: { backgroundColor: '#7A9E78' },
    planBtnFilledText: {
      fontSize: 14,
      color: '#FAF5EE',
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    section: { marginBottom: 24 },
    sectionLabel: {
      fontSize: 10,
      fontWeight: '600',
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      color: '#A89878',
      marginBottom: 12,
    },
    qtCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      padding: 14,
      marginBottom: 8,
      gap: 12,
    },
    qtDot: { width: 8, height: 8, borderRadius: 4 },
    qtBody: { flex: 1 },
    qtName: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
    qtDesc: { fontSize: 11 },
    lockBadge: {
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#333',
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    lockText: { fontSize: 9, color: '#666', letterSpacing: 1, textTransform: 'uppercase' },
    teamCard: {
      backgroundColor: '#3A4830',
      borderRadius: 14,
      padding: 20,
      marginBottom: 20,
    },
    teamTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: '#FAF5EE',
      marginBottom: 8,
    },
    teamBody: {
      fontSize: 13,
      color: '#A8B898',
      lineHeight: 20,
      marginBottom: 12,
      fontStyle: 'italic',
    },
    teamLink: {
      fontSize: 13,
      color: '#7A9E78',
      fontWeight: '500',
    },
    fine: {
      fontSize: 11,
      color: '#C8B898',
      textAlign: 'center',
      fontStyle: 'italic',
    },
  });