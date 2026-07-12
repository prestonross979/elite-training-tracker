import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import type { CardioMeasurement } from '../../types/training';
import type { SessionCardioEntry } from '../../storage/workoutSession';
import { colors } from '../../theme/colors';
import Badge from '../common/Badge';

type TextField = 'durationMinutes' | 'distanceMiles' | 'rounds' | 'roundDurationSeconds' | 'restSeconds' | 'calories' | 'steps' | 'notes';

type Props = {
  activityName: string;
  entry: SessionCardioEntry;
  supportedMeasurements: CardioMeasurement[];
  onChangeField: (field: TextField, value: string) => void;
  onToggleComplete: () => void;
};

function supports(measurements: CardioMeasurement[], measurement: CardioMeasurement): boolean {
  return measurements.includes(measurement);
}

export default function CardioLogCard({ activityName, entry, supportedMeasurements, onChangeField, onToggleComplete }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>
            {entry.completed ? '✅ ' : ''}
            {activityName}
          </Text>
        </View>
        <Badge label={entry.intensity} />
      </View>

      <View style={styles.fieldGrid}>
        {supports(supportedMeasurements, 'duration') ? (
          <View style={styles.field}>
            <Text style={styles.label}>Duration (min)</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textSubtle}
              value={entry.durationMinutes}
              onChangeText={(value) => onChangeField('durationMinutes', value)}
            />
          </View>
        ) : null}

        {supports(supportedMeasurements, 'distance') ? (
          <View style={styles.field}>
            <Text style={styles.label}>Distance (mi)</Text>
            <TextInput
              style={styles.input}
              keyboardType="decimal-pad"
              placeholder="0"
              placeholderTextColor={colors.textSubtle}
              value={entry.distanceMiles}
              onChangeText={(value) => onChangeField('distanceMiles', value)}
            />
          </View>
        ) : null}

        {supports(supportedMeasurements, 'rounds') ? (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Rounds</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSubtle}
                value={entry.rounds}
                onChangeText={(value) => onChangeField('rounds', value)}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Round (sec)</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSubtle}
                value={entry.roundDurationSeconds}
                onChangeText={(value) => onChangeField('roundDurationSeconds', value)}
              />
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>Rest (sec)</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.textSubtle}
                value={entry.restSeconds}
                onChangeText={(value) => onChangeField('restSeconds', value)}
              />
            </View>
          </>
        ) : null}

        {supports(supportedMeasurements, 'calories') ? (
          <View style={styles.field}>
            <Text style={styles.label}>Calories</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Optional"
              placeholderTextColor={colors.textSubtle}
              value={entry.calories}
              onChangeText={(value) => onChangeField('calories', value)}
            />
          </View>
        ) : null}

        {supports(supportedMeasurements, 'steps') ? (
          <View style={styles.field}>
            <Text style={styles.label}>Steps</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="Optional"
              placeholderTextColor={colors.textSubtle}
              value={entry.steps}
              onChangeText={(value) => onChangeField('steps', value)}
            />
          </View>
        ) : null}
      </View>

      <TextInput
        style={styles.notes}
        placeholder="Notes: effort, weather, how it felt"
        placeholderTextColor={colors.textSubtle}
        multiline
        value={entry.notes}
        onChangeText={(value) => onChangeField('notes', value)}
      />

      <Pressable style={[styles.completeButton, entry.completed && styles.completeButtonDone]} onPress={onToggleComplete}>
        <Text style={styles.completeButtonText}>{entry.completed ? 'Completed' : 'Mark Complete'}</Text>
      </Pressable>
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
    padding: 12,
    gap: 10,
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  title: { color: colors.text, fontSize: 15, fontWeight: '800' },
  fieldGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  field: { minWidth: 100, flexGrow: 1 },
  label: { color: colors.textMuted, fontSize: 11, marginBottom: 4, fontWeight: '600' },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
  },
  notes: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  completeButton: { backgroundColor: colors.accent, borderRadius: 16, padding: 12, alignItems: 'center' },
  completeButtonDone: { backgroundColor: colors.success },
  completeButtonText: { color: colors.accentText, fontWeight: '800' },
});
