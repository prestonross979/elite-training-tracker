import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WorkoutDay } from '../../types/training';
import { colors } from '../../theme/colors';
import Badge from '../common/Badge';

type Props = {
  day: WorkoutDay;
  isSelected?: boolean;
  isRecommended?: boolean;
  onPress: () => void;
};

export default function WorkoutDayCard({ day, isSelected, isRecommended, onPress }: Props) {
  return (
    <Pressable style={[styles.card, isSelected && styles.cardSelected]} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{day.name}</Text>
        {isRecommended ? <Badge label="Next Up" tone="accent" /> : null}
      </View>

      <Text style={styles.meta}>
        {day.type} {day.exercises.length > 0 ? `• ${day.exercises.length} exercises` : ''}
        {day.cardioGroups.length > 0 ? ' • cardio options' : ''}
      </Text>

      {day.targetMuscles.length > 0 ? (
        <Text style={styles.muscles}>{day.targetMuscles.join(', ')}</Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    marginRight: 10,
    minWidth: 160,
  },
  cardSelected: {
    borderColor: colors.accent,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
    flexShrink: 1,
  },
  meta: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 6,
    textTransform: 'capitalize',
  },
  muscles: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 6,
    textTransform: 'capitalize',
  },
});
