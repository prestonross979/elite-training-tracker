import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { TrainingPlan } from '../../types/training';
import { colors } from '../../theme/colors';
import Badge from '../common/Badge';

type Props = {
  plan: TrainingPlan;
  isActive?: boolean;
  onPress: () => void;
};

export default function PlanCard({ plan, isActive, onPress }: Props) {
  return (
    <Pressable style={[styles.card, isActive && styles.cardActive]} onPress={onPress}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{plan.name}</Text>
        {plan.isFeatured ? <Badge label="Featured" tone="accent" /> : null}
      </View>

      <Text style={styles.description}>{plan.description}</Text>

      <View style={styles.badgeRow}>
        <Badge label={plan.difficulty} />
        <Badge label={`${plan.daysPerCycle}-day cycle`} />
        {plan.recommendedTrainingDaysPerWeek ? (
          <Badge label={`${plan.recommendedTrainingDaysPerWeek}x / week`} />
        ) : null}
      </View>

      <Text style={styles.goals}>{plan.trainingGoals.join(' • ')}</Text>

      {isActive ? <Text style={styles.activeLabel}>Currently Active</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 12,
  },
  cardActive: {
    borderColor: colors.accent,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
    flexShrink: 1,
  },
  description: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  goals: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 8,
    textTransform: 'capitalize',
  },
  activeLabel: {
    color: colors.success,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 10,
  },
});
