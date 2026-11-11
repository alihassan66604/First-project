import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';

export function BlogToolkitScreen() {
  const [title, setTitle] = useState('How to Choose the Best Leather Wallet in 2026');
  const [slug, setSlug] = useState('/how-to-choose-the-best-leather-wallet-in-2026');
  const [meta, setMeta] = useState(
    'Complete buyer guide to finding high-grade full-grain leather wallets with RFID protection and slim minimalist pocket fit in 2026.'
  );

  const handleGenerate = () => {
    const cleanTitle = title.trim() || 'Blog Post';
    const cleanSlug =
      '/' +
      cleanTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    setSlug(cleanSlug);
    setMeta(
      `Discover everything you need to know about ${cleanTitle}. Read expert tips, comparison analysis and 2026 buying guide recommendations.`
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>✍️ Blog SEO Toolkit</Text>
        <Text style={styles.subtitle}>Auto-generate clean slugs &amp; 155-char meta descriptions</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Article / Blog Post Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Type blog title..."
        />
        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Text style={styles.btnText}>Generate Slug &amp; Meta Description →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Optimized URL Slug</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultSlug}>{slug}</Text>
        </View>

        <Text style={[styles.label, { marginTop: 12 }]}>Meta Description ({meta.length}/160)</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultMeta}>{meta}</Text>
        </View>
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
  card: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  label: { fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 6 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  resultBox: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
  },
  resultSlug: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4f46e5',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  resultMeta: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
});
