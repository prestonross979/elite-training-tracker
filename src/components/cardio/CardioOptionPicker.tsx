import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { CardioSelectionGroup } from '../../types/training';
import { getCardioActivityById } from '../../data/cardio';
import { colors } from '../../theme/colors';

type Props = {
  group: CardioSelectionGroup;
  selectedOptionId?: string;
  onSelect: (optionId: string) => void;
};

function describeOption(durationMinutes?: number, rounds?: number, roundDurationSeconds?: number): string {
  if (rounds) {
    const roundSeconds = roundDurationSeconds ?? 0;
    return `${rounds} rounds${roundSeconds ? ` x ${roundSeconds}s` : ''}`;
  }
  if (durationMinutes) {
    return `${durationMinutes} min`;
  }
  return '';
}

export default function CardioOptionPicker({ group, selectedOptionId, onSelect }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{group.title}</Text>
      {group.description ? <Text style={styles.description}>{group.description}</Text> : null}

      <View style={styles.options}>
        {group.options.map((option) => {
          const activity = getCardioActivityById(option.cardioActivityId);
          const isSelected = selectedOptionId === option.id;

          return (
            <Pressable
              key={option.id}
              style={[styles.option, isSelected && styles.optionSelected]}
              onPress={() => onSelect(option.id)}
            >
              <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                {activity?.name ?? option.cardioActivityId}
              </Text>
              <Text style={[styles.optionMeta, isSelected && styles.optionTextSelected]}>
                {describeOption(option.durationMinutes, option.rounds, option.roundDurationSeconds)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  title: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  description: {
    color: colors.textSubtle,
    fontSize: 11,
    marginTop: 2,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  option: {
    backgroundColor: colors.surfaceMuted,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  optionText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '700',
  },
  optionMeta: {
    color: colors.textSubtle,
    fontSize: 10,
    marginTop: 2,
  },
  optionTextSelected: {
    color: colors.accentText,
  },
});
