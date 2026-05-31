import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native'

export default function Landing({ onNavigate }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Image 
          source={require('../assets/Hero1.png')} 
          style={styles.heroImage} 
          resizeMode="contain"
        />
        <Text style={styles.heroTitle}>Empowering Educators, Inspiring Students</Text>
        <Text style={styles.heroSubtitle}>The complete SIS solution for modern schools.</Text>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => onNavigate('Dashboard')}>
            <Text style={styles.btnText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnOutline} onPress={() => onNavigate('Attendance')}>
            <Text style={styles.btnOutlineText}>Attendance</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Core Capabilities</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Student Portfolios</Text>
          <Text style={styles.featureText}>Maintain detailed digital records for every student.</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Smart Attendance</Text>
          <Text style={styles.featureText}>Class-aware attendance tracking that takes seconds.</Text>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureTitle}>Academic Planning</Text>
          <Text style={styles.featureText}>Coordinate classes and manage teacher schedules.</Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  hero: { padding: 40, backgroundColor: '#2b6cb0', alignItems: 'center', justifyContent: 'center' },
  heroImage: { width: '100%', height: 150, marginBottom: 20 },
  heroTitle: { fontSize: 28, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSubtitle: { fontSize: 16, color: '#fff', textAlign: 'center', opacity: 0.9, marginBottom: 30 },
  btnRow: { flexDirection: 'row', gap: 15 },
  btnPrimary: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#2b6cb0', fontWeight: '700' },
  btnOutline: { borderWidth: 2, borderColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  btnOutlineText: { color: '#fff', fontWeight: '700' },
  section: { padding: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, color: '#2d3748' },
  featureCard: { backgroundColor: '#fff', padding: 20, borderRadius: 10, marginBottom: 15, elevation: 2 },
  featureTitle: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  featureText: { color: '#718096', lineHeight: 22 }
})
