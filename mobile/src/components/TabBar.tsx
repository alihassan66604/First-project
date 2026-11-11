import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TabType } from '../types';

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenMenu: () => void;
}

const PRIMARY_TABS: { id: TabType; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Home', icon: '🏠' },
  { id: 'keywords', label: 'Keywords', icon: '🔍' },
  { id: 'clusters', label: '25 Groups', icon: '🗂️' },
  { id: 'etsy', label: '13 Tags', icon: '🛍️' },
];

export function TabBar({ activeTab, onTabChange, onOpenMenu }: TabBarProps) {
  return (
    <View style={styles.container}>
      {PRIMARY_TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, isActive && styles.activeTab]}
            onPress={() => onTabChange(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.icon}>{tab.icon}</Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}

      {/* 5th Tab: All 12 Tools Button */}
      <TouchableOpacity
        style={styles.tab}
        onPress={onOpenMenu}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>☰</Text>
        <Text style={styles.label}>All Tools</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingVertical: 6,
    paddingBottom: 16,
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 4,
  },
  activeTab: {
    borderTopColor: '#4f46e5',
  },
  icon: {
    fontSize: 18,
    marginBottom: 2,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748b',
  },
  activeLabel: {
    color: '#4f46e5',
    fontWeight: '800',
  },
});
