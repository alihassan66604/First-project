import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { UserSession, TabType } from '../types';

interface DashboardScreenProps {
  session: UserSession;
  onNavigate: (tab: TabType) => void;
}

export function DashboardScreen({ session, onNavigate }: DashboardScreenProps) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerRow}>
          <Text style={styles.bannerBadge}>CLIENT WORKSPACE</Text>
          <Text style={styles.bannerStatus}>● Active</Text>
        </View>
        <Text style={styles.bannerTitle}>Welcome, {session.name.split(' ')[0]}!</Text>
        <Text style={styles.bannerSubtitle}>Shop: {session.shopName || 'Etsy Creator'}</Text>
      </View>

      {/* Metrics Row */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>5,000</Text>
          <Text style={styles.statLabel}>Keywords Target</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#10b981' }]}>25</Text>
          <Text style={styles.statLabel}>Topic Clusters</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNum, { color: '#8b5cf6' }]}>100%</Text>
          <Text style={styles.statLabel}>SEO Health</Text>
        </View>
      </View>

      {/* Quick Launch Tools */}
      <Text style={styles.sectionTitle}>All 12 Client SEO Tools</Text>
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('keywords')}>
          <Text style={styles.gridIcon}>🔍</Text>
          <Text style={styles.gridLabel}>5,000 Keywords</Text>
          <Text style={styles.gridSub}>Google &amp; Etsy Suggest</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('clusters')}>
          <Text style={styles.gridIcon}>🗂️</Text>
          <Text style={styles.gridLabel}>25 Groups</Text>
          <Text style={styles.gridSub}>Topic Clusters</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('etsy')}>
          <Text style={styles.gridIcon}>🛍️</Text>
          <Text style={styles.gridLabel}>Etsy 13 Tags QA</Text>
          <Text style={styles.gridSub}>140-char title check</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('article')}>
          <Text style={styles.gridIcon}>📄</Text>
          <Text style={styles.gridLabel}>Article Builder</Text>
          <Text style={styles.gridSub}>H1, H2, H3 Outlines</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('coverage')}>
          <Text style={styles.gridIcon}>🎯</Text>
          <Text style={styles.gridLabel}>Content Coverage</Text>
          <Text style={styles.gridSub}>0-100% Score</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('checker')}>
          <Text style={styles.gridIcon}>🔎</Text>
          <Text style={styles.gridLabel}>SEO Checker</Text>
          <Text style={styles.gridSub}>Audit Scorecard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('blog')}>
          <Text style={styles.gridIcon}>✍️</Text>
          <Text style={styles.gridLabel}>Blog SEO</Text>
          <Text style={styles.gridSub}>Slug &amp; Meta Tags</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('ideas')}>
          <Text style={styles.gridIcon}>💡</Text>
          <Text style={styles.gridLabel}>100+ Ideas</Text>
          <Text style={styles.gridSub}>Tested Blueprints</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('projects')}>
          <Text style={styles.gridIcon}>📁</Text>
          <Text style={styles.gridLabel}>Saved Projects</Text>
          <Text style={styles.gridSub}>Saved Collections</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('assistant')}>
          <Text style={styles.gridIcon}>🤖</Text>
          <Text style={styles.gridLabel}>AI Assistant</Text>
          <Text style={styles.gridSub}>SEO Questions &amp; QA</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('export')}>
          <Text style={styles.gridIcon}>📤</Text>
          <Text style={styles.gridLabel}>Export Center</Text>
          <Text style={styles.gridSub}>CSV &amp; JSON</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.gridItem} onPress={() => onNavigate('profile')}>
          <Text style={styles.gridIcon}>👤</Text>
          <Text style={styles.gridLabel}>My Account</Text>
          <Text style={styles.gridSub}>Settings &amp; Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  banner: {
    backgroundColor: '#4f46e5',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  bannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  bannerBadge: {
    color: '#c7d2fe',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  bannerStatus: {
    color: '#86efac',
    fontSize: 10,
    fontWeight: '700',
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  bannerSubtitle: {
    color: '#e0e7ff',
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4f46e5',
  },
  statLabel: {
    fontSize: 9,
    color: '#64748b',
    fontWeight: '700',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  gridIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
  },
  gridSub: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
});
