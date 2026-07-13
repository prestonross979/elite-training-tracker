import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { colors } from '../../theme/colors';

type Props = {
  label: string;
  tone?: 'default' | 'accent';
};

export default function Badge({ label, tone = 'default' }: Props) {
  return <Text style={[styles.badge, tone === 'accent' && styles.badgeAccent]}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    color: colors.text,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 10,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: '700',
  },
  badgeAccent: {
    backgroundColor: colors.accent,
    color: colors.accentText,
  },
});
