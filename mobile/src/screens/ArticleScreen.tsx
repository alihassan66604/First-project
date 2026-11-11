import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

export function ArticleScreen() {
  const [topic, setTopic] = useState('Handmade Leather Wallets');
  const [outlines, setOutlines] = useState<string[]>([
    'H1: Ultimate Guide to Handmade Leather Wallets (2026 Strategy)',
    'H2: Why Leather Wallets are High-Demand on Google & Etsy',
    'H3: Top Materials: Full-Grain Leather vs Top-Grain',
    'H2: Step-by-Step Production & Crafting Quality Checklist',
    'H3: Optimizing the 140-Character Title & Exactly 13 Tags',
    'H2: Pricing Strategy & Shipping Packaging for 5-Star Reviews',
  ]);

  const handleGenerate = () => {
    const t = topic.trim() || 'Digital Products';
    setOutlines([
      `H1: Complete Guide to ${t} (2026 High Ranking Strategy)`,
      `H2: Search Demand & Buyer Intent for ${t} on Google & Etsy`,
      `H3: Top Tools & Materials to Create Winning ${t}`,
      `H2: Step-by-Step Listing Setup & Keyword Placement`,
      `H3: Compliance: Exact 13 Tags & 140 Chars Title Limit`,
      `H2: Maximizing Conversion Rates & Repeat Buyers`,
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>📄 Page Article Builder</Text>
        <Text style={styles.subtitle}>Generate SEO-structured H1, H2, H3 article outlines</Text>
      </View>

      <View style={styles.inputCard}>
        <Text style={styles.label}>Article Topic or Product Seed</Text>
        <TextInput
          style={styles.input}
          value={topic}
          onChangeText={setTopic}
          placeholder="e.g. Wedding Invitations, Leather Journal..."
        />
        <TouchableOpacity style={styles.btn} onPress={handleGenerate}>
          <Text style={styles.btnText}>Generate H1, H2, H3 Outline →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Structured Headings Outline ({outlines.length})</Text>
      <View style={styles.outlinesList}>
        {outlines.map((h, i) => (
          <View key={i} style={styles.outlineItem}>
            <Text style={styles.headingText}>{h}</Text>
          </View>
        ))}
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
  inputCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
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
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  outlinesList: { gap: 8 },
  outlineItem: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  headingText: { fontSize: 12, fontWeight: '700', color: '#1e293b' },
});
