import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ExerciseLog } from '../../logic';
import { colors } from '../../theme/colors';
import Badge from '../common/Badge';

type Props = {
  title: string;
  meta: string;
  log: ExerciseLog;
  isOptional?: boolean;
  recommendation?: string;
  onUpdateSet: (setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onUpdateField: (field: 'completed' | 'notes', value: boolean | string) => void;
};

export default function ExerciseLogCard({ title, meta, log, isOptional, recommendation, onUpdateSet, onUpdateField }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable onPress={() => setIsOpen((prev) => !prev)}>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>
                {log.completed ? '✅ ' : ''}
                {title}
              </Text>
              {isOptional ? <Badge label="Optional" /> : null}
            </View>
            <Text style={styles.subtle}>{meta}</Text>
          </View>

          <Text style={styles.subtle}>{isOpen ? 'Hide' : 'Open'}</Text>
        </View>
      </Pressable>

      {isOpen && (
        <View style={styles.openArea}>
          {recommendation ? (
            <View style={styles.progressionBox}>
              <Text style={styles.label}>Progression</Text>
              <Text style={styles.bodyText}>{recommendation}</Text>
            </View>
          ) : null}

          {log.sets.map((set, setIndex) => (
            <View key={setIndex} style={styles.setRow}>
              <Text style={styles.setLabel}>Set {setIndex + 1}</Text>

              <TextInput
                style={styles.setInput}
                placeholder="Weight"
                placeholderTextColor={colors.textSubtle}
                keyboardType="decimal-pad"
                value={set.weight}
                onChangeText={(value) => onUpdateSet(setIndex, 'weight', value)}
              />

              <TextInput
                style={styles.setInput}
                placeholder="Reps"
                placeholderTextColor={colors.textSubtle}
                keyboardType="number-pad"
                value={set.reps}
                onChangeText={(value) => onUpdateSet(setIndex, 'reps', value)}
              />
            </View>
          ))}

          <TextInput
            style={styles.notes}
            placeholder="Notes: energy, sleep, pump, pain"
            placeholderTextColor={colors.textSubtle}
            multiline
            value={log.notes}
            onChangeText={(value) => onUpdateField('notes', value)}
          />

          <Pressable
            style={[styles.completeButton, log.completed && styles.completeButtonDone]}
            onPress={() => onUpdateField('completed', !log.completed)}
          >
            <Text style={styles.completeButtonText}>{log.completed ? 'Completed' : 'Mark Complete'}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    marginTop: 12,
    overflow: 'hidden',
    padding: 12,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { color: colors.text, fontSize: 15, fontWeight: '800' },
  subtle: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  openArea: { paddingTop: 14, borderTopWidth: 1, borderTopColor: colors.borderMuted, gap: 10, marginTop: 12 },
  progressionBox: { backgroundColor: colors.surface, borderRadius: 16, padding: 12, borderWidth: 1, borderColor: colors.borderMuted },
  label: { color: colors.textMuted, fontSize: 12, marginBottom: 6, fontWeight: '600' },
  bodyText: { color: '#f4f4f5', fontSize: 13, lineHeight: 19 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setLabel: { color: '#e4e4e7', width: 48, fontSize: 12 },
  setInput: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
  },
  notes: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 90,
    textAlignVertical: 'top',
  },
  completeButton: { backgroundColor: colors.accent, borderRadius: 16, padding: 12, alignItems: 'center' },
  completeButtonDone: { backgroundColor: colors.success },
  completeButtonText: { color: colors.accentText, fontWeight: '800' },
});
