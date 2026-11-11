import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';

export function ExportScreen() {
  const handleShareCSV = async () => {
    try {
      await Share.share({
        message: 'Keyword,Search Intent,Relevance Score\nleather wallet,commercial,100\nleather wallet men,transactional,98\npersonalized wallet,commercial,95\nslim bifold,informational,90',
        title: 'Keywords Export (CSV)',
      });
    } catch {
      // Ignored
    }
  };

  const handleShareJSON = async () => {
    try {
      const data = [
        { keyword: 'leather wallet', intent: 'commercial', score: 100 },
        { keyword: 'leather wallet men', intent: 'transactional', score: 98 },
      ];
      await Share.share({
        message: JSON.stringify(data, null, 2),
        title: 'Keywords Export (JSON)',
      });
    } catch {
      // Ignored
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📤 Export Center</Text>
        <Text style={styles.subtitle}>Export your keyword data and reports on mobile</Text>
      </View>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.exportCard} onPress={handleShareCSV}>
          <Text style={styles.icon}>📊</Text>
          <Text style={styles.cardTitle}>Share / Download CSV</Text>
          <Text style={styles.cardDesc}>Compatible with Excel, Google Sheets, Numbers</Text>
          <View style={styles.btnPill}>
            <Text style={styles.btnPillText}>Export CSV</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exportCard} onPress={handleShareJSON}>
          <Text style={styles.icon}>💾</Text>
          <Text style={styles.cardTitle}>Export JSON Data</Text>
          <Text style={styles.cardDesc}>Structured raw format for developers &amp; integrations</Text>
          <View style={[styles.btnPill, { backgroundColor: '#8b5cf6' }]}>
            <Text style={styles.btnPillText}>Export JSON</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 14 },
  title: { fontSize: 18, fontWeight: '900', color: '#0f172a' },
  subtitle: { fontSize: 11, color: '#64748b', marginTop: 2 },
  grid: { gap: 12 },
  exportCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    gap: 6,
  },
  icon: { fontSize: 32 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0f172a' },
  cardDesc: { fontSize: 11, color: '#64748b', textAlign: 'center', marginBottom: 6 },
  btnPill: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  btnPillText: { color: '#ffffff', fontSize: 11, fontWeight: '800' },
});
