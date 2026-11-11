import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { api } from '../services/api';
import { KeywordItem } from '../types';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ur', label: 'Urdu' },
  { code: 'hi', label: 'Hindi' },
  { code: 'es', label: 'Spanish' },
  { code: 'ar', label: 'Arabic' },
  { code: 'fr', label: 'French' },
];

const TARGET_COUNTS = [50, 100, 250, 500, 1000];

export function KeywordsScreen() {
  const [query, setQuery] = useState('digital planner');
  const [source, setSource] = useState<'google_autocomplete' | 'etsy_autocomplete'>('google_autocomplete');
  const [lang, setLang] = useState('en');
  const [targetCount, setTargetCount] = useState(100);
  const [keywords, setKeywords] = useState<KeywordItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setSelectedIds(new Set());

    try {
      const items = await api.fetchKeywordSuggestions({
        query: query.trim(),
        source,
        lang,
        targetCount,
      });
      setKeywords(items);
    } catch (err: any) {
      Alert.alert('Search Error', err?.message || 'Could not fetch suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleCopySelected = () => {
    const listToCopy = selectedIds.size > 0
      ? keywords.filter(k => selectedIds.has(k.id)).map(k => k.keyword)
      : keywords.slice(0, 13).map(k => k.keyword);

    if (listToCopy.length === 0) {
      Alert.alert('Notice', 'No keywords to copy.');
      return;
    }

    const text = listToCopy.join(', ');
    Alert.alert('Copied to Clipboard!', `${listToCopy.length} keywords copied:\n\n${text}`);
  };

  const getIntentBadgeVariant = (intent: string) => {
    switch (intent) {
      case 'transactional':
        return 'success';
      case 'commercial':
        return 'primary';
      case 'informational':
        return 'info';
      default:
        return 'neutral';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Keyword Engine"
        subtitle="Live Google &amp; Etsy real-time long-tail suggestions"
        badge={keywords.length > 0 ? `${keywords.length} Results` : undefined}
      />

      {/* Control Panel */}
      <View style={styles.controlPanel}>
        {/* Source Toggle */}
        <View style={styles.toggleRow}>
          <TouchableOpacity
            style={[styles.toggleBtn, source === 'google_autocomplete' && styles.toggleActive]}
            onPress={() => setSource('google_autocomplete')}
          >
            <Text style={[styles.toggleText, source === 'google_autocomplete' && styles.toggleActiveText]}>
              🌐 Google Autocomplete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toggleBtn, source === 'etsy_autocomplete' && styles.toggleActive]}
            onPress={() => setSource('etsy_autocomplete')}
          >
            <Text style={[styles.toggleText, source === 'etsy_autocomplete' && styles.toggleActiveText]}>
              🛍️ Etsy Marketplace
            </Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Enter seed niche (e.g. wedding invitation)"
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity
            style={[styles.searchBtn, loading && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.searchBtnText}>Search</Text>}
          </TouchableOpacity>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {/* Language Selector */}
          <View style={styles.pillsList}>
            {LANGUAGES.map((l) => (
              <TouchableOpacity
                key={l.code}
                style={[styles.pill, lang === l.code && styles.pillActive]}
                onPress={() => setLang(l.code)}
              >
                <Text style={[styles.pillText, lang === l.code && styles.pillTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Target Count */}
          <View style={styles.countPills}>
            {TARGET_COUNTS.map((cnt) => (
              <TouchableOpacity
                key={cnt}
                style={[styles.countPill, targetCount === cnt && styles.countPillActive]}
                onPress={() => setTargetCount(cnt)}
              >
                <Text style={[styles.countPillText, targetCount === cnt && styles.countPillTextActive]}>
                  {cnt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Bar */}
        {keywords.length > 0 && (
          <View style={styles.actionBar}>
            <Text style={styles.actionText}>
              {selectedIds.size > 0 ? `${selectedIds.size} selected` : `Showing ${keywords.length} keywords`}
            </Text>
            <TouchableOpacity style={styles.copyBtn} onPress={handleCopySelected}>
              <Text style={styles.copyBtnText}>
                📋 {selectedIds.size > 0 ? `Copy Selected (${selectedIds.size})` : 'Copy First 13 Tags'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Keywords List */}
      <FlatList
        data={keywords}
        keyExtractor={(item: KeywordItem) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item, index }: { item: KeywordItem; index: number }) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <TouchableOpacity
              style={[styles.keywordCard, isSelected && styles.keywordCardSelected]}
              onPress={() => toggleSelect(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.kwLeft}>
                <Text style={styles.kwIndex}>#{index + 1}</Text>
                <View>
                  <Text style={styles.kwText}>{item.keyword}</Text>
                  <View style={styles.kwMeta}>
                    <Badge label={item.search_intent} variant={getIntentBadgeVariant(item.search_intent)} />
                    <Text style={styles.kwRelevance}>Rel: {Math.round(item.relevance_score * 100)}%</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.singleCopyBtn}
                onPress={() => Alert.alert('Copied!', `"${item.keyword}" copied to clipboard.`)}
              >
                <Text style={styles.singleCopyIcon}>📋</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🔎</Text>
              <Text style={styles.emptyTitle}>Start Keyword Exploration</Text>
              <Text style={styles.emptySubtitle}>
                Type your niche above to generate up to 5,000 live search queries.
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  controlPanel: {
    backgroundColor: '#ffffff',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  toggleActive: {
    backgroundColor: '#4f46e5',
  },
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  toggleActiveText: {
    color: '#ffffff',
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  searchBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchBtnDisabled: {
    opacity: 0.6,
  },
  searchBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  pillsList: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  pillActive: {
    backgroundColor: '#e0e7ff',
  },
  pillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  pillTextActive: {
    color: '#4338ca',
    fontWeight: '800',
  },
  countPills: {
    flexDirection: 'row',
    gap: 4,
  },
  countPill: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  countPillActive: {
    backgroundColor: '#10b981',
  },
  countPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
  },
  countPillTextActive: {
    color: '#ffffff',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  actionText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
  },
  copyBtn: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },
  listContent: {
    padding: 12,
    gap: 8,
  },
  keywordCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  keywordCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f5f3ff',
  },
  kwLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  kwIndex: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    width: 28,
  },
  kwText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  kwMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  kwRelevance: {
    fontSize: 10,
    color: '#64748b',
  },
  singleCopyBtn: {
    padding: 6,
  },
  singleCopyIcon: {
    fontSize: 14,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 30,
  },
});
