import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { api, DEFAULT_API_URL } from '../services/api';
import { UserSession } from '../types';

interface ProfileScreenProps {
  session: UserSession;
  onLogout: () => void;
}

export function ProfileScreen({ session, onLogout }: ProfileScreenProps) {
  const [backendUrl, setBackendUrl] = useState(api.getBaseUrl());
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveUrl = () => {
    api.setBaseUrl(backendUrl.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
    Alert.alert('Saved', `Backend endpoint updated to: ${backendUrl}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Client Account"
        subtitle="Etsy shop settings, sync and mobile preferences"
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👩‍💼</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{session.name || 'Etsy Shop Creator'}</Text>
            <Text style={styles.userEmail}>{session.email}</Text>
            <View style={styles.badgeRow}>
              <Badge label="PRO CLIENT" variant="primary" />
              <Badge label="ACTIVE" variant="success" />
            </View>
          </View>
        </View>

        {/* Sync Settings Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend API Connection</Text>
          <Text style={styles.cardSubtitle}>
            Connect mobile app to your desktop server or local network
          </Text>

          <TextInput
            style={styles.input}
            value={backendUrl}
            onChangeText={setBackendUrl}
            placeholder={DEFAULT_API_URL}
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSaveUrl}>
            <Text style={styles.saveBtnText}>
              {isSaved ? '✓ Connection Saved' : 'Save Endpoint URL'}
            </Text>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Network Tips:</Text>
            <Text style={styles.infoText}>&bull; Android Emulator: http://10.0.2.2:3000</Text>
            <Text style={styles.infoText}>&bull; Physical Phone (Expo Go): http://YOUR_PC_IP:3000</Text>
            <Text style={styles.infoText}>&bull; Offline Mode: Works automatically with built-in engine</Text>
          </View>
        </View>

        {/* Features Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mobile Privileges &amp; Features</Text>
          <View style={styles.perkRow}>
            <Text style={styles.perkIcon}>✓</Text>
            <Text style={styles.perkText}>Unlimited Google &amp; Etsy Autocomplete queries</Text>
          </View>
          <View style={styles.perkRow}>
            <Text style={styles.perkIcon}>✓</Text>
            <Text style={styles.perkText}>25 Semantic Groups / Topic Clustering</Text>
          </View>
          <View style={styles.perkRow}>
            <Text style={styles.perkIcon}>✓</Text>
            <Text style={styles.perkText}>Etsy 140-char title &amp; 13 tags compliance validator</Text>
          </View>
          <View style={styles.perkRow}>
            <Text style={styles.perkIcon}>✓</Text>
            <Text style={styles.perkText}>100+ Digital product blueprints &amp; tags</Text>
          </View>
          <View style={styles.perkRow}>
            <Text style={styles.perkIcon}>✓</Text>
            <Text style={styles.perkText}>Multi-language support (Urdu, Hindi, Spanish, etc.)</Text>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutBtnText}>Sign Out of Mobile App</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 14,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  userEmail: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
  },
  cardSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  saveBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: '#f8fafc',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 10,
    color: '#64748b',
    marginVertical: 1,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  perkIcon: {
    fontSize: 12,
    fontWeight: '900',
    color: '#10b981',
  },
  perkText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '500',
  },
  logoutBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 20,
  },
  logoutBtnText: {
    color: '#b91c1c',
    fontWeight: '800',
    fontSize: 13,
  },
});
