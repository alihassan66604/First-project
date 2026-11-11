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
import { api } from '../services/api';
import { ClusterGroup } from '../types';

export function ClustersScreen() {
  const [inputText, setInputText] = useState(
    'digital wedding invitation, canva wedding template, printable rsvp card, boho wedding invite, floral wedding stationery, minimalist wedding program, electronic save the date, editable reception card, wedding budget sheet, bridal shower games, bachelorette itinerary, groomsmen invitation card, maid of honor planner, modern monogram stationery, elegant calligraphy invite, rustic barn wedding cards, rustic thank you cards, engagement party invite, rehearsal dinner template, photo wedding invitation, gold foil wedding card, custom wedding menu printable, arched table numbers, seating chart template, vow books printable'
  );
  const [targetGroups, setTargetGroups] = useState(25);
  const [clusters, setClusters] = useState<ClusterGroup[]>([]);
  const [loading, setLoading] = useState(false);

  const handleCluster = async () => {
    const rawList = inputText
      .split(/[\n,]+/)
      .map((k) => k.trim())
      .filter(Boolean);

    if (rawList.length === 0) {
      Alert.alert('Notice', 'Please enter some keywords to group.');
      return;
    }

    setLoading(true);
    try {
      const groups = await api.generateClusters(rawList, targetGroups);
      setClusters(groups);
    } catch (err: any) {
      Alert.alert('Clustering Error', err?.message || 'Could not group keywords.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCluster = (group: ClusterGroup) => {
    const tags = group.keywords.join(', ');
    Alert.alert('Copied!', `Group "${group.name}" copied:\n\n${tags}`);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Keyword Grouping"
        subtitle="Organize keywords into 25 semantic topic clusters"
        badge={clusters.length > 0 ? `${clusters.length} Groups` : undefined}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Paste Keywords (comma or newline separated):</Text>
          <TextInput
            style={styles.textArea}
            value={inputText}
            onChangeText={setInputText}
            multiline
            numberOfLines={4}
            placeholder="wedding planner, digital template, goodnotes planner..."
          />

          <View style={styles.groupSelectorRow}>
            <Text style={styles.selectorLabel}>Target Groups:</Text>
            {[25, 20, 15, 10].map((num) => (
              <TouchableOpacity
                key={num}
                style={[styles.numBtn, targetGroups === num && styles.numBtnActive]}
                onPress={() => setTargetGroups(num)}
              >
                <Text style={[styles.numBtnText, targetGroups === num && styles.numBtnTextActive]}>
                  {num}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.clusterBtn}
            onPress={handleCluster}
            disabled={loading}
          >
            <Text style={styles.clusterBtnText}>
              {loading ? 'Clustering...' : `⚡ Generate ${targetGroups} Semantic Groups`}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Clusters List */}
        {clusters.length > 0 && (
          <View style={styles.clustersContainer}>
            <View style={styles.summaryBar}>
              <Text style={styles.summaryText}>
                Generated {clusters.length} Groups &bull; Ready for Listing &amp; Ad Targets
              </Text>
            </View>

            {clusters.map((group, idx) => (
              <View key={group.id} style={styles.groupCard}>
                <View style={styles.groupHeader}>
                  <View style={styles.groupTitleWrap}>
                    <Text style={styles.groupBadge}>#{idx + 1}</Text>
                    <Text style={styles.groupTitle}>{group.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.copyTagsBtn}
                    onPress={() => handleCopyCluster(group)}
                  >
                    <Text style={styles.copyTagsBtnText}>📋 Copy Tags</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.chipsRow}>
                  {group.keywords.map((kw, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{kw}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 10,
    fontSize: 12,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  groupSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  selectorLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
  },
  numBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#f1f5f9',
  },
  numBtnActive: {
    backgroundColor: '#4f46e5',
  },
  numBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  numBtnTextActive: {
    color: '#ffffff',
  },
  clusterBtn: {
    backgroundColor: '#4f46e5',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 12,
  },
  clusterBtnText: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },
  clustersContainer: {
    gap: 10,
  },
  summaryBar: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
  },
  summaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },
  groupCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  groupTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  groupBadge: {
    fontSize: 11,
    fontWeight: '800',
    color: '#4f46e5',
  },
  groupTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  copyTagsBtn: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  copyTagsBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  chipText: {
    fontSize: 11,
    color: '#334155',
  },
});
