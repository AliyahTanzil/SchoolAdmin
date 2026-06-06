import React, { useState } from 'react'
import { View, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { colors } from '../theme'

export default function ProfileUpload({ studentId, currentImage }) {
  const [uploading, setUploading] = useState(false)
  const [image, setImage] = useState(currentImage)

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync()
    if (status !== 'granted') return

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5
    })

    if (!result.canceled) {
      setUploading(true)
      setImage(result.assets[0].uri)
      
      // Simulate direct upload to storage
      setTimeout(() => setUploading(false), 2000)
    }
  }

  return (
    <TouchableOpacity onPress={takePhoto} style={styles.container}>
      <View style={styles.avatarWrapper}>
        {image ? <Image source={{ uri: image }} style={styles.image} /> : <View style={styles.placeholder} />}
        {uploading && <View style={styles.overlay}><ActivityIndicator color={colors.primary} /></View>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  avatarWrapper: { width: 64, height: 64, borderRadius: 32, overflow: 'hidden', backgroundColor: '#f1f5f9' },
  image: { width: '100%', height: '100%' },
  placeholder: { flex: 1, backgroundColor: '#cbd5e1' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})