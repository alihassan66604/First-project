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
import { TRADEMARK_BLACKLIST } from '../services/mockData';

export function CoverageScreen() {
  const [title, setTitle] = useState(
    'Digital Wedding Planner Template | Editable GoodNotes iPad Routine Tracker Printable'
  );
  const [tagsInput, setTagsInput] = useState(
    'wedding planner, digital planner, goodnotes planner, bridal shower gift, daily schedule, budget template, printable planner, habit tracker, routine log, wedding organizer, guest list tracker, seating chart, instant download'
  );

  const tagsList = tagsInput
    .split(/[,]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const titleLength = title.length;
  const isTitleValid = titleLength > 0 && titleLength <= 140;
  const isTagCountValid = tagsList.length === 13;
  const tagsOverLimit = tagsList.filter((t) => t.length > 20);
  const violations = [title, ...tagsList].flatMap((text) =>
    TRADEMARK_BLACKLIST.filter((tm) => text.toLowerCase().includes(tm))
  );

  const isCompliant =
    isTitleValid && isTagCountValid && tagsOverLimit.length === 0 && violations.length === 0;

  const handleCopy13Tags = () => {
    if (tagsList.length === 0) {
      Alert.alert('Notice', 'No tags entered.');
      return;
    }
    const formatted = tagsList.join(', ');
    Alert.alert(
      'Copied 13 Etsy Tags!',
      `Ready to paste into Etsy Shop Manager:\n\n${formatted}`
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title="Listing QA &amp; Compliance"
        subtitle="Etsy algorithm audit: 140-char title, 13 tags &amp; trademarks"
        badge={isCompliant ? '100% Compliant' : 'Issues Detected'}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Compliance Status Banner */}
        <View style={[styles.statusBanner, isCompliant ? styles.bannerSuccess : styles.bannerWarning]}>
          <Text style={styles.bannerEmoji}>{isCompliant ? '✅' : '⚠️'}</Text>
          <View style={styles.bannerTextBox}>
            <Text style={[styles.bannerTitle, isCompliant ? styles.textSuccess : styles.textWarning]}>
              {isCompliant ? 'Ready to Publish on Etsy!' : 'Compliance Fixes Required'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              {isCompliant
                ? 'Title length, 13 tags rule, and trademark screenings all passed.'
                : 'Check title character limits, tag counts, or trademark warnings below.'}
            </Text>
          </View>
        </View>

        {/* 1. Title Input & Audit */}
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Listing Title (Etsy SEO)</Text>
            <Text style={[styles.counter, titleLength <= 140 ? styles.counterOk : styles.counterError]}>
              {titleLength} / 140 chars {titleLength > 140 ? '(EXCEEDED)' : ''}
            </Text>
          </View>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            multiline
            numberOfLines={2}
          />
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, (titleLength / 140) * 100)}%` },
                titleLength <= 140 ? styles.barOk : styles.barError,
              ]}
            />
          </View>
        </View>

        {/* 2. 13 Tags Input & Audit */}
        <View style={styles.card}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Etsy Tags (Comma-separated)</Text>
            <Text style={[styles.counter, isTagCountValid ? styles.counterOk : styles.counterError]}>
              {tagsList.length} / 13 Tags {tagsList.length === 13 ? '✓' : '(MUST BE 13)'}
            </Text>
          </View>
          <TextInput
            style={styles.textArea}
            value={tagsInput}
            onChangeText={setTagsInput}
            multiline
            numberOfLines={4}
          />

          {tagsOverLimit.length > 0 && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ {tagsOverLimit.length} tag(s) exceed 20 characters limit:
              </Text>
              {tagsOverLimit.map((t, i) => (
                <Text key={i} style={styles.warningDetail}>
                  &bull; "{t}" ({t.length} chars)
                </Text>
              ))}
            </View>
          )}

          {violations.length > 0 && (
            <View style={styles.dangerBox}>
              <Text style={styles.dangerText}>
                🚨 Trademark warning detected: {violations.join(', ')}
              </Text>
            </View>
          )}

          <TouchableOpacity style={styles.copyTagsBtn} onPress={handleCopy13Tags}>
            <Text style={styles.copyTagsBtnText}>📋 1-Tap Copy 13 Tags for Etsy</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Tags Chips Preview */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Tags Preview ({tagsList.length}):</Text>
          <View style={styles.tagsGrid}>
            {tagsList.map((tag, i) => (
              <View key={i} style={styles.tagPill}>
                <Text style={styles.tagPillIndex}>#{i + 1}</Text>
                <Text style={styles.tagPillText}>{tag}</Text>
                <Text style={styles.tagCharCount}>{tag.length}c</Text>
              </View>
            ))}
          </View>
        </View>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 10,
  },
  bannerSuccess: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  bannerWarning: {
    backgroundColor: '#fffbeb',
    borderColor: '#fde68a',
  },
  bannerEmoji: {
    fontSize: 24,
  },
  bannerTextBox: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '800',
  },
  textSuccess: {
    color: '#065f46',
  },
  textWarning: {
    color: '#92400e',
  },
  bannerSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  counter: {
    fontSize: 11,
    fontWeight: '700',
  },
  counterOk: {
    color: '#16a34a',
  },
  counterError: {
    color: '#dc2626',
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#f1f5f9',
    borderRadius: 2,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  barOk: {
    backgroundColor: '#10b981',
  },
  barError: {
    backgroundColor: '#ef4444',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  warningBox: {
    backgroundColor: '#fffbeb',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  warningText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b45309',
  },
  warningDetail: {
    fontSize: 10,
    color: '#92400e',
    marginLeft: 6,
  },
  dangerBox: {
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  dangerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#b91c1c',
  },
  copyTagsBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  copyTagsBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagPillIndex: {
    fontSize: 9,
    fontWeight: '700',
    color: '#6366f1',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },
  tagCharCount: {
    fontSize: 9,
    color: '#94a3b8',
  },
});
