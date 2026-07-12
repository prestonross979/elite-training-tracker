import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { SessionSummary } from '../../logic/sessionSummary';
import { colors } from '../../theme/colors';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

type Props = {
  summary: SessionSummary;
  onDone: () => void;
};

export default function WorkoutSummaryCard({ summary, onDone }: Props) {
  return (
    <Card>
      <Text style={styles.title}>Workout Complete</Text>
      <Text style={styles.subtle}>{summary.workoutName}</Text>

      <View style={styles.statsRow}>
        {summary.totalExercises > 0 ? (
          <Badge label={`${summary.completedExercises}/${summary.totalExercises} exercises`} />
        ) : null}
        {summary.totalCompletedSets > 0 ? <Badge label={`${summary.totalCompletedSets} sets logged`} /> : null}
        {summary.cardio.length > 0 ? <Badge label={`${summary.cardio.length} cardio`} /> : null}
      </View>

      {summary.cardio.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Cardio</Text>
          {summary.cardio.map((entry) => (
            <Text key={entry.name} style={styles.bodyText}>
              {entry.completed ? '✅ ' : ''}
              {entry.name} — {entry.detail}
            </Text>
          ))}
        </View>
      ) : null}

      {summary.recommendations.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Progression Notes</Text>
          {summary.recommendations.map((rec) => (
            <View key={rec.exerciseName} style={{ marginTop: 6 }}>
              <Text style={styles.exerciseName}>{rec.exerciseName}</Text>
              <Text style={styles.bodyText}>{rec.text}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {summary.nextWorkoutName ? (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Next Recommended Workout</Text>
          <Text style={styles.bodyText}>{summary.nextWorkoutName}</Text>
        </View>
      ) : null}

      <View style={{ marginTop: 14 }}>
        <Button label="Done" onPress={onDone} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  subtle: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 },
  section: { marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderMuted },
  sectionLabel: { color: colors.textSubtle, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 6 },
  exerciseName: { color: colors.text, fontSize: 13, fontWeight: '700' },
  bodyText: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },
});
