import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';

const TRADEMARKS = ['disney', 'nike', 'apple', 'cricut', 'lego', 'barbie', 'chanel', 'gucci', 'iphone'];

export function CheckerScreen() {
  const [title, setTitle] = useState('Vintage Handmade Journal Notebook - Disney Style');
  const [tags, setTags] = useState('journal, notebook, diary, disney, gift, book, writing, paper, blank book, travel note');
  const [auditResult, setAuditResult] = useState<any>(null);

  const handleAudit = () => {
    const tagList = tags.split(',').map((t) => t.trim()).filter(Boolean);
    const titleLen = title.length;
    const over20 = tagList.filter((t) => t.length > 20);
    const tm = [title, ...tagList].flatMap((txt) =>
      TRADEMARKS.filter((t) => txt.toLowerCase().includes(t))
    );

    const score =
      titleLen <= 140 && tagList.length === 13 && over20.length === 0 && tm.length === 0 ? 100 : 70;

    setAuditResult({
      score,
      titleLen,
      tagsCount: tagList.length,
      over20Count: over20.length,
      violations: tm,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>🔎 SEO Checker &amp; Audit</Text>
        <Text style={styles.subtitle}>Audit any Etsy listing for trademarks &amp; ranking gaps</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Listing Title to Check</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Listing Title..."
        />

        <Text style={styles.label}>Listing Tags (Comma-Separated)</Text>
        <TextInput
          style={[styles.input, { minHeight: 60 }]}
          value={tags}
          onChangeText={setTags}
          multiline
          placeholder="tag1, tag2, tag3..."
        />

        <TouchableOpacity style={styles.btn} onPress={handleAudit}>
          <Text style={styles.btnText}>Run Comprehensive SEO Audit →</Text>
        </TouchableOpacity>
      </View>

      {auditResult && (
        <View style={styles.resultCard}>
          <View style={styles.scoreHeader}>
            <Text style={styles.scoreText}>{auditResult.score}/100</Text>
            <Text style={styles.scoreBadge}>
              {auditResult.score === 100 ? '✓ Excellent' : '⚠️ Action Needed'}
            </Text>
          </View>

          <View style={styles.issuesList}>
            {auditResult.violations.length > 0 && (
              <Text style={styles.issueRed}>
                • ⚠️ Trademark Violation: "{auditResult.violations.join(', ')}" detected. Remove to avoid suspension.
              </Text>
            )}
            {auditResult.tagsCount !== 13 && (
              <Text style={styles.issueAmber}>
                • Missing tags: {auditResult.tagsCount}/13 used. Add {13 - auditResult.tagsCount} more tags.
              </Text>
            )}
            {auditResult.titleLen > 140 && (
              <Text style={styles.issueRed}>
                • Title exceeds limit: {auditResult.titleLen}/140 chars. Shorten to fit Etsy.
              </Text>
            )}
            {auditResult.score === 100 && (
              <Text style={styles.issueGreen}>
                • Perfect listing! 100% compliant with Etsy algorithms.
              </Text>
            )}
          </View>
        </View>
      )}
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
  label: { fontSize: 11, fontWeight: '700', color: '#334155', marginBottom: 5 },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 10,
    fontSize: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: { color: '#ffffff', fontWeight: '800', fontSize: 12 },
  resultCard: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  scoreHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  scoreText: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
  scoreBadge: { fontSize: 11, fontWeight: '700', color: '#b45309' },
  issuesList: { gap: 6 },
  issueRed: { fontSize: 11, color: '#dc2626', fontWeight: '600' },
  issueAmber: { fontSize: 11, color: '#b45309', fontWeight: '600' },
  issueGreen: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
});
