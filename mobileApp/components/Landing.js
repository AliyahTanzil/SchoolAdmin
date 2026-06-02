import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native'

const { width } = Dimensions.get('window')

export default function Landing({ onNavigate }) {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>New: Attendance v2.0</Text>
        </View>
        <Text style={styles.heroTitle}>The Intelligent OS for <Text style={styles.textBlue}>Modern Schools</Text></Text>
        <Text style={styles.heroSubtitle}>Streamline your institution with an all-in-one platform for success.</Text>
        
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => onNavigate('Dashboard')}>
            <Text style={styles.btnText}>Start for Free</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => onNavigate('Attendance')}>
            <Text style={styles.btnOutlineText}>Live Demo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mockupContainer}>
          <Image 
            source={require('../assets/Hero1.png')} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTag}>CORE CAPABILITIES</Text>
        <Text style={styles.sectionTitle}>Scale success with ease</Text>
        
        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#eff6ff' }]}>
             <Text style={{ color: '#3b82f6', fontWeight: 'bold' }}>S</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Student Portfolios</Text>
            <Text style={styles.featureText}>Maintain detailed digital records for every student.</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#ecfdf5' }]}>
             <Text style={{ color: '#10b981', fontWeight: 'bold' }}>A</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Smart Attendance</Text>
            <Text style={styles.featureText}>Class-aware tracking that takes seconds.</Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <View style={[styles.iconBox, { backgroundColor: '#f5f3ff' }]}>
             <Text style={{ color: '#8b5cf6', fontWeight: 'bold' }}>P</Text>
          </View>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Academic Planning</Text>
            <Text style={styles.featureText}>Coordinate classes and manage schedules.</Text>
          </View>
        </View>
      </View>

      <View style={styles.ctaSection}>
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Ready to transform?</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => onNavigate('Dashboard')}>
            <Text style={styles.ctaBtnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { padding: 24, backgroundColor: '#f8fafc', alignItems: 'center' },
  badge: { backgroundColor: '#dbeafe', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  badgeText: { color: '#1e40af', fontSize: 12, fontWeight: '700' },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#0f172a', textAlign: 'center', marginBottom: 12, lineHeight: 40 },
  textBlue: { color: '#3b82f6' },
  heroSubtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 12, marginBottom: 40 },
  btnPrimary: { backgroundColor: '#3b82f6', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, elevation: 4, minWidth: 140, marginBottom: 10 },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  btnOutline: { borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12, minWidth: 140, marginBottom: 10 },
  btnOutlineText: { color: '#0f172a', fontWeight: '600', fontSize: 16 },
  mockupContainer: { width: '100%', maxWidth: width - 48, height: 200, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  heroImage: { width: '100%', height: '100%' },
  section: { padding: 24, paddingTop: 40 },
  sectionTag: { color: '#3b82f6', fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: 8 },
  sectionTitle: { fontSize: 24, fontWeight: '800', color: '#0f172a', marginBottom: 32 },
  featureCard: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24, alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16, marginBottom: 12 },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: 18, fontWeight: '700', color: '#0f172a', marginBottom: 4 },
  featureText: { color: '#64748b', fontSize: 14, lineHeight: 20 },
  ctaSection: { padding: 24, paddingBottom: 60 },
  ctaCard: { backgroundColor: '#3b82f6', padding: 32, borderRadius: 24, alignItems: 'center' },
  ctaTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginBottom: 20 },
  ctaBtn: { backgroundColor: '#fff', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  ctaBtnText: { color: '#3b82f6', fontWeight: '700', fontSize: 16 }
})
