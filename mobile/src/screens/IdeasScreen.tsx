import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { Header } from '../components/Header';
import { Badge } from '../components/Badge';
import { DIGITAL_PRODUCT_IDEAS } from '../services/mockData';
import { ProductIdea } from '../types';

const CATEGORIES = [
  'All',
  'Notion Templates',
  'Canva Templates',
  'GoodNotes Planners',
  'Wedding Stationery',
  'Budgeting & Finance',
  'Printable Wall Art',
  'Kids & Learning',
  'Resume & Career',
];

export function IdeasScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIdeas = DIGITAL_PRODUCT_IDEAS.filter((idea) => {
    const matchCat = selectedCategory === 'All' || idea.category === selectedCategory;
    const matchQuery =
      searchQuery.trim() === '' ||
      idea.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      idea.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchQuery;
  });

  const handleCopyTags = (idea: ProductIdea) => {
    const tags = idea.tags.join(', ');
    Alert.alert('Tags Copied!', `Etsy Tags for "${idea.title}":\n\n${tags}`);
  };

  const getDifficultyVariant = (diff: string) => {
    switch (diff) {
      case 'Easy':
        return 'success';
      case 'Medium':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="100+ Product Ideas"
        subtitle="High-demand digital Etsy templates &amp; blueprints"
        badge={`${filteredIdeas.length} Available`}
      />

      {/* Search Bar */}
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Filter ideas (e.g. planner, resume, wedding)..."
        />
      </View>

      {/* Category Pills Carousel */}
      <View style={styles.categoryScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item: string) => item}
          contentContainerStyle={styles.categoryContent}
          renderItem={({ item }: { item: string }) => {
            const isActive = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text
                  style={[styles.categoryText, isActive && styles.categoryTextActive]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Ideas List */}
      <FlatList
        data={filteredIdeas}
        keyExtractor={(item: ProductIdea) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }: { item: ProductIdea }) => (
          <View style={styles.ideaCard}>
            <View style={styles.cardHeader}>
              <View style={styles.catWrap}>
                <Text style={styles.catName}>{item.category}</Text>
                <Badge label={item.difficulty} variant={getDifficultyVariant(item.difficulty)} />
              </View>
              <Text style={styles.priceTag}>{item.estPrice}</Text>
            </View>

            <Text style={styles.ideaTitle}>{item.title}</Text>
            <Text style={styles.audienceText}>Target Audience: {item.audience}</Text>

            <View style={styles.tagsRow}>
              {item.tags.map((tag: string, i: number) => (
                <View key={i} style={styles.tagChip}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => handleCopyTags(item)}
            >
              <Text style={styles.actionBtnText}>📋 Copy Recommended Etsy Tags</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchBox: {
    paddingHorizontal: 14,
    paddingTop: 10,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
  },
  categoryScroll: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  categoryContent: {
    paddingHorizontal: 14,
    gap: 6,
  },
  categoryPill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  categoryPillActive: {
    backgroundColor: '#4f46e5',
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  ideaCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  catWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  catName: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4f46e5',
    textTransform: 'uppercase',
  },
  priceTag: {
    fontSize: 12,
    fontWeight: '800',
    color: '#16a34a',
  },
  ideaTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  audienceText: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: 10,
  },
  tagChip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagChipText: {
    fontSize: 10,
    color: '#475569',
  },
  actionBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },
});
