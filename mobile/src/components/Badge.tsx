import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'info' | 'neutral';
}

export function Badge({ label, variant = 'neutral' }: BadgeProps) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'primary':
        return { bg: '#e0e7ff', text: '#4338ca' };
      case 'success':
        return { bg: '#dcfce7', text: '#15803d' };
      case 'warning':
        return { bg: '#fef3c7', text: '#b45309' };
      case 'info':
        return { bg: '#e0f2fe', text: '#0369a1' };
      default:
        return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  const colors = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
});
