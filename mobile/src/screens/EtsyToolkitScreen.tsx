import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';

const TRADEMARKS = ['disney', 'nike', 'apple', 'cricut', 'lego', 'barbie', 'chanel', 'gucci', 'iphone'];

export function EtsyToolkitScreen() {
  const [title, setTitle] = useState('Personalized Leather Wallet for Men, Slim Bifold Cardholder, Anniversary Gift');
  const [tagsInput, setTagsInput] = useState(
    'leather wallet, mens wallet, bifold wallet, personalized gift, anniversary gift, slim card holder, rfid blocking, groomsmen gift, handcrafted wallet, monogrammed wallet, minimalist wallet, gift for him, custom wallet'
  );

  const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
  const titleLen = title.length;
  const isTitleValid = titleLen > 0 && titleLen <= 140;
  const isTagsCountValid = tags.length === 13;
  const over20Tags = tags.filter((t) => t.length > 20);
  const hits = [title, ...tags].flatMap((txt) =>
    TRADEMARKS.filter((tm) => txt.toLowerCase().includes(tm))
  );

  const isCompliant = isTitleValid && isTagsCountValid && over20Tags.length === 0 && hits.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🛍️ Etsy 13 Tags &amp; Title QA</Text>
        <Text style={styles.subtitle}>Strict 140-char title &amp; exactly 13 tags verification</Text>
      </View>

      {/* Scorecard */}
      <View style={[styles.scorecard, isCompliant ? styles.passCard : styles.warnCard]}>
        <Text style={[styles.scoreStatus, { color: isCompliant ? '#15803d' : '#b45309' }]}>
          {isCompliant ? '✓ 100% Etsy Listing Compliant' : '⚠️ Action Required'}
        </Text>
        <Text style={styles.scoreDetail}>
          • Title: {titleLen}/140 chars ({isTitleValid ? 'Pass' : 'Exceeded'})
        </Text>
        <Text style={styles.scoreDetail}>
          • Tags Count: {tags.length}/13 tags ({isTagsCountValid ? 'Pass' : 'Must be exactly 13'})
        </Text>
        <Text style={styles.scoreDetail}>
          • Max 20 chars/tag: {over20Tags.length === 0 ? 'Pass' : `${over20Tags.length} tags too long`}
        </Text>
        <Text style={styles.scoreDetail}>
          • Trademarks: {hits.length === 0 ? '0 Hits (Safe)' : `Violations: ${hits.join(', ')}`}
        </Text>
      </View>

      {/* Title Input */}
      <View style={styles.inputCard}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Listing Title</Text>
          <Text style={[styles.counter, isTitleValid ? styles.counterPass : styles.counterFail]}>
            {titleLen}/140
          </Text>
        </View>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          multiline
          placeholder="Type Etsy title..."
        />
      </View>

      {/* Tags Input */}
      <View style={styles.inputCard}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>13 Listing Tags (Comma-Separated)</Text>
          <Text style={[styles.counter, isTagsCountValid ? styles.counterPass : styles.counterWarn]}>
            {tags.length}/13
          </Text>
        </View>
        <TextInput
          style={[styles.input, { minHeight: 80 }]}
          value={tagsInput}
          onChangeText={setTagsInput}
          multiline
          placeholder="tag1, tag2, tag3..."
        />
      </View>

      {/* Tags Chips Preview */}
      <Text style={styles.sectionTitle}>Tags Visual Breakdown ({tags.length})</Text>
      <View style={styles.tagsChipContainer}>
        {tags.map((t, i) => (
          <View
            key={i}
            style={[
              styles.tagChip,
              t.length > 20 && styles.tagChipError,
            ]}
          >
            <Text
              style={[
                styles.tagChipText,
                t.length > 20 && styles.tagChipTextError,
              ]}
            >
              #{i + 1} {t} ({t.length}c)
            </Text>
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
  scorecard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 14,
  },
  passCard: { backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' },
  warnCard: { backgroundColor: '#fffbeb', borderColor: '#fde68a' },
  scoreStatus: { fontSize: 13, fontWeight: '800', marginBottom: 6 },
  scoreDetail: { fontSize: 11, color: '#334155', marginTop: 2 },
  inputCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
  },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  label: { fontSize: 11, fontWeight: '700', color: '#334155' },
  counter: { fontSize: 11, fontWeight: '800' },
  counterPass: { color: '#10b981' },
  counterWarn: { color: '#f59e0b' },
  counterFail: { color: '#ef4444' },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    color: '#0f172a',
  },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  tagsChipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagChipError: { backgroundColor: '#fee2e2' },
  tagChipText: { fontSize: 10, fontWeight: '700', color: '#4338ca' },
  tagChipTextError: { color: '#b91c1c' },
});
