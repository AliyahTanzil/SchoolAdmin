import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { colors, shadow } from '../../theme'
import SystemsPanel from './SystemsPanel'
import ActionCard from '../ui/ActionCard'
import Panel from '../ui/Panel'
import StatCard from '../ui/StatCard'

export default function RoleDashboardLayout({
  navigation,
  hero,
  stats,
  actions,
  alerts,
  meters,
  notes,
  accent = '#2563eb'
}) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.hero, { backgroundColor: accent }]}>
        <Text style={styles.kicker}>{hero.kicker}</Text>
        <Text style={styles.heroTitle}>{hero.title}</Text>
        <Text style={styles.heroText}>{hero.description}</Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroCardLabel}>{hero.cardLabel}</Text>
          <Text style={styles.heroCardTitle}>{hero.cardTitle}</Text>
          <Text style={styles.heroCardText}>{hero.cardText}</Text>
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} style={styles.statCard} />
        ))}
      </View>

      <SystemsPanel navigation={navigation} />

      <Panel title="Actions" subtitle="Fast access to the tools used by this role.">
        {actions.map((item) => (
          <ActionCard
            key={item.title}
            title={item.title}
            description={item.description}
            onPress={() => navigation.navigate(item.screen)}
          />
        ))}
      </Panel>

      <Panel title="Alerts" subtitle="Items that need attention today.">
        {alerts.map((alert) => (
          <View key={alert.title} style={styles.alertItem}>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertDetail}>{alert.detail}</Text>
          </View>
        ))}
      </Panel>

      <Panel title="Snapshot">
        {meters.map((meter) => (
          <View key={meter.label} style={styles.meterRow}>
            <Text style={styles.meterLabel}>{meter.label}</Text>
            <Text style={styles.meterValue}>{meter.value}</Text>
          </View>
        ))}
      </Panel>

      <Panel title="Notes">
        {notes.map((note) => (
          <Text key={note} style={styles.note}>{note}</Text>
        ))}
      </Panel>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { backgroundColor: colors.background, flex: 1 },
  content: { padding: 18, paddingBottom: 28 },
  hero: { borderRadius: 18, marginBottom: 16, padding: 22, ...shadow },
  kicker: { color: 'rgba(255,255,255,0.78)', fontSize: 12, fontWeight: '900', letterSpacing: 0.7, textTransform: 'uppercase' },
  heroTitle: { color: colors.surface, fontSize: 26, fontWeight: '900', lineHeight: 31, marginTop: 10 },
  heroText: { color: 'rgba(255,255,255,0.86)', lineHeight: 22, marginTop: 12 },
  heroCard: { backgroundColor: colors.surface, borderRadius: 14, marginTop: 18, padding: 16 },
  heroCardLabel: { color: colors.textLight, fontSize: 12, fontWeight: '900', letterSpacing: 0.4, textTransform: 'uppercase' },
  heroCardTitle: { color: colors.text, fontSize: 20, fontWeight: '900', marginTop: 8 },
  heroCardText: { color: colors.textLight, lineHeight: 21, marginTop: 6 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { marginBottom: 12, width: '48%' },
  alertItem: { backgroundColor: colors.background, borderColor: colors.border, borderRadius: 12, borderWidth: 1, marginTop: 10, padding: 14 },
  alertTitle: { color: colors.text, fontWeight: '900' },
  alertDetail: { color: colors.textLight, lineHeight: 20, marginTop: 4 },
  meterRow: {
    alignItems: 'center',
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    padding: 14
  },
  meterLabel: { color: colors.textLight, flex: 1, marginRight: 12 },
  meterValue: { color: colors.text, fontWeight: '900' },
  note: { color: colors.textLight, lineHeight: 21, marginTop: 8 }
})
