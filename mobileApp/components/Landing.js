import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'
import { colors, shadow } from '../theme'

const { width } = Dimensions.get('window')

export default function Landing({ navigation }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>New: Attendance v2.0 Released</Text>
          </View>
          <Text style={styles.heroTitle}>The Intelligent Operating System for <Text style={styles.textGradient}>Modern Schools</Text></Text>
          <Text style={styles.heroSubtitle}>
            Streamline your institution with an all-in-one platform for student success, teacher coordination, and automated attendance tracking.
          </Text>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Dashboard')}>
              <Text style={styles.primaryBtnText}>Start for Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.navigate('Attendance')}>
              <Text style={styles.secondaryBtnText}>Live Demo</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.heroTrust}>
            <Text style={styles.trustLabel}>Trusted by 500+ educators worldwide</Text>
            <View style={styles.avatarGroup}>
              {[1, 2, 3, 4].map((item, index) => (
                <View key={item} style={[styles.avatarSmall, { backgroundColor: `hsl(${index * 60}, 70%, 60%)` }]} />
              ))}
              <Text style={styles.avatarPlus}>+10k</Text>
            </View>
          </View>
        </View>

        <View style={styles.heroVisual}>
          <View style={styles.browserMockup}>
            <View style={styles.browserHeader}>
              <View style={styles.dots}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <Text style={styles.addressBar}>schooladmin.app/dashboard</Text>
            </View>
            <Image
              source={require('../assets/Hero1.png')}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.floatCard}>
            <View style={styles.floatIcon}>
              <Text style={styles.floatIconText}>✓</Text>
            </View>
            <View style={styles.floatTextGroup}>
              <Text style={styles.floatLabel}>Attendance Rate</Text>
              <Text style={styles.floatValue}>98.4%</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.statsSection}>
        {[
          { value: '500+', label: 'Schools Empowered' },
          { value: '10k+', label: 'Active Teachers' },
          { value: '1M+', label: 'Students Tracked' },
          { value: '99.9%', label: 'Platform Uptime' },
        ].map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.featuresSection}>
        <Text style={styles.sectionHeading}>Everything you need to <Text style={styles.textGradient}>scale success</Text></Text>
        <Text style={styles.sectionSubheading}>Our modular architecture grows with your institution, from single classrooms to entire school districts.</Text>

        <View style={styles.featureGrid}>
          {[
            { title: 'Student Portfolios', detail: 'Centralized digital records with performance tracking, behavioral insights, and history.', color: '#eff6ff', icon: 'S' },
            { title: 'Smart Attendance', detail: 'Rapid class-aware tracking with automated daily reports and parent notifications.', color: '#ecfdf5', icon: 'A' },
            { title: 'Academic Planning', detail: 'Dynamic scheduling and curriculum management designed for collaborative teaching.', color: '#f5f3ff', icon: 'P' },
            { title: 'Advanced Analytics', detail: 'Visualize trends and identify students who need extra support with built-in BI tools.', color: '#fff7ed', icon: 'D' },
          ].map((feature) => (
            <View key={feature.title} style={styles.featureCard}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Text style={[styles.featureIconText, { color: feature.icon === 'A' ? '#10b981' : feature.icon === 'P' ? '#8b5cf6' : feature.icon === 'D' ? '#f97316' : '#3b82f6' }]}>{feature.icon}</Text>
              </View>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.detail}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ctaSection}>
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to transform your school?</Text>
          <Text style={styles.ctaText}>Join thousands of educators who have simplified their administrative workflow.</Text>
          <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate('Dashboard')}>
            <Text style={styles.ctaButtonText}>Get Started Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroSection: { padding: 24, backgroundColor: colors.background },
  heroContent: { alignItems: 'center', marginBottom: 32 },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, marginBottom: 20 },
  badgeText: { color: '#1e40af', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: colors.text, textAlign: 'center', lineHeight: 42, marginBottom: 16 },
  textGradient: { color: colors.primary },
  heroSubtitle: { textAlign: 'center', color: colors.textLight, fontSize: 16, lineHeight: 24, maxWidth: 520, marginBottom: 28 },
  heroActions: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  primaryBtn: { backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginHorizontal: 6, marginBottom: 10 },
  primaryBtnText: { color: colors.surface, fontWeight: '700', fontSize: 16 },
  secondaryBtn: { borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 14, marginHorizontal: 6, marginBottom: 10 },
  secondaryBtnText: { color: colors.text, fontWeight: '700', fontSize: 16 },
  heroTrust: { marginTop: 24, alignItems: 'center' },
  trustLabel: { color: colors.textLight, fontWeight: '600', marginBottom: 12 },
  avatarGroup: { flexDirection: 'row', alignItems: 'center' },
  avatarSmall: { width: 36, height: 36, borderRadius: 999, borderWidth: 2, borderColor: colors.surface, marginLeft: -10 },
  avatarPlus: { marginLeft: 14, color: colors.primary, fontWeight: '700' },
  heroVisual: { alignItems: 'center' },
  browserMockup: { width: width - 48, maxWidth: 560, borderRadius: 20, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', ...shadow },
  browserHeader: { backgroundColor: '#f1f5f9', padding: 14, flexDirection: 'row', alignItems: 'center' },
  dots: { flexDirection: 'row' },
  dot: { width: 10, height: 10, borderRadius: 999, backgroundColor: '#cbd5e1', marginRight: 8 },
  addressBar: { flex: 1, textAlign: 'center', color: '#94a3b8', fontSize: 12, backgroundColor: colors.surface, paddingVertical: 6, borderRadius: 999 },
  heroImage: { width: '100%', height: 220 },
  floatCard: { position: 'absolute', bottom: -18, left: 14, backgroundColor: colors.surface, padding: 16, borderRadius: 18, flexDirection: 'row', alignItems: 'center', ...shadow },
  floatIcon: { width: 38, height: 38, borderRadius: 999, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center' },
  floatIconText: { color: colors.primary, fontWeight: '800' },
  floatTextGroup: { marginLeft: 12 },
  floatLabel: { color: colors.textLight, fontSize: 12, fontWeight: '700' },
  floatValue: { fontSize: 18, fontWeight: '800', color: colors.text },
  statsSection: { paddingHorizontal: 24, paddingTop: 72, paddingBottom: 32, backgroundColor: colors.surface },
  statCard: { backgroundColor: colors.surface, borderRadius: 20, padding: 20, marginBottom: 14, ...shadow },
  statValue: { fontSize: 28, fontWeight: '800', color: colors.text, marginBottom: 8 },
  statLabel: { color: colors.textLight, fontSize: 14, fontWeight: '700' },
  featuresSection: { paddingHorizontal: 24, paddingBottom: 32, backgroundColor: colors.background },
  sectionHeading: { fontSize: 26, fontWeight: '800', color: colors.text, marginBottom: 12 },
  sectionSubheading: { color: colors.textLight, fontSize: 16, lineHeight: 24, marginBottom: 24 },
  featureGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  featureCard: { width: '48%', minWidth: '48%', backgroundColor: colors.surface, borderRadius: 20, padding: 18, marginBottom: 16, ...shadow },
  featureIcon: { width: 46, height: 46, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  featureIconText: { fontSize: 18, fontWeight: '800' },
  featureTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginBottom: 8 },
  featureDescription: { color: colors.textLight, fontSize: 14, lineHeight: 20 },
  ctaSection: { padding: 24, paddingBottom: 48, backgroundColor: colors.background },
  ctaCard: { backgroundColor: colors.primary, borderRadius: 24, padding: 28, ...shadow },
  ctaTitle: { color: colors.surface, fontSize: 24, fontWeight: '800', marginBottom: 16, textAlign: 'center' },
  ctaText: { color: colors.surface, fontSize: 16, lineHeight: 24, textAlign: 'center', marginBottom: 20 },
  ctaButton: { backgroundColor: colors.surface, paddingVertical: 16, borderRadius: 14, alignItems: 'center' },
  ctaButtonText: { color: colors.primary, fontWeight: '800', fontSize: 16 },
})
