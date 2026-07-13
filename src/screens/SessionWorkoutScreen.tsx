import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { WorkoutSession, SessionCardioEntry } from '../storage/workoutSession';
import type { PlannedExercise } from '../types/training';
import type { ExerciseLog } from '../logic';
import { getExerciseById } from '../data/exercises';
import { getCardioActivityById } from '../data/cardio';
import { getPlannedExerciseRecommendation } from '../logic/planProgression';
import { colors } from '../theme/colors';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import ExerciseLogCard from '../components/workouts/ExerciseLogCard';
import CardioLogCard from '../components/workouts/CardioLogCard';

type CardioTextField = keyof Pick<
  SessionCardioEntry,
  'durationMinutes' | 'distanceMiles' | 'rounds' | 'roundDurationSeconds' | 'restSeconds' | 'calories' | 'steps' | 'notes'
>;

type Props = {
  session: WorkoutSession;
  planName: string;
  onUpdateExerciseSet: (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onUpdateExerciseField: (exerciseId: string, field: 'completed' | 'notes', value: boolean | string) => void;
  onUpdateCardioField: (plannedOptionId: string, field: CardioTextField, value: string) => void;
  onToggleCardioComplete: (plannedOptionId: string) => void;
  onComplete: () => void;
  onCancel: () => void;
};

export default function SessionWorkoutScreen({
  session,
  planName,
  onUpdateExerciseSet,
  onUpdateExerciseField,
  onUpdateCardioField,
  onToggleCardioComplete,
  onComplete,
  onCancel,
}: Props) {
  const completedSets = session.exercises.reduce((total, exercise) => total + (exercise.completed ? 1 : 0), 0);

  return (
    <View style={styles.section}>
      <Card>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{session.workoutName}</Text>
            <Text style={styles.subtle}>{planName}</Text>
          </View>
          <Badge label={session.dayType} />
        </View>

        {session.exercises.length > 0 ? <Text style={styles.subtle}>{completedSets}/{session.exercises.length} exercises complete</Text> : null}

        <View style={{ marginTop: 12 }}>
          <Button label="Cancel Workout" variant="secondary" onPress={onCancel} />
        </View>
      </Card>

      {session.exercises.length === 0 && session.cardio.length === 0 ? (
        <Card>
          <Text style={styles.subtle}>Nothing planned for this day.</Text>
        </Card>
      ) : null}

      {session.exercises.map((sessionExercise, index) => {
        const exercise = getExerciseById(sessionExercise.exerciseId);
        if (!exercise) return null;

        const planned: PlannedExercise = {
          id: sessionExercise.plannedExerciseId,
          exerciseId: sessionExercise.exerciseId,
          sets: sessionExercise.sets.length,
          repRange: sessionExercise.repRange,
          order: index,
        };

        const log: ExerciseLog = {
          name: exercise.name,
          completed: sessionExercise.completed,
          notes: sessionExercise.notes,
          sets: sessionExercise.sets,
        };

        return (
          <ExerciseLogCard
            key={sessionExercise.plannedExerciseId}
            title={exercise.name}
            meta={`${planned.sets} sets • ${sessionExercise.repRange}`}
            log={log}
            isOptional={sessionExercise.isOptional}
            recommendation={getPlannedExerciseRecommendation(exercise, planned, log)}
            onUpdateSet={(setIndex, field, value) => onUpdateExerciseSet(sessionExercise.exerciseId, setIndex, field, value)}
            onUpdateField={(field, value) => onUpdateExerciseField(sessionExercise.exerciseId, field, value)}
          />
        );
      })}

      {session.cardio.map((entry) => {
        const activity = getCardioActivityById(entry.cardioActivityId);
        if (!activity) return null;

        return (
          <CardioLogCard
            key={entry.plannedOptionId}
            activityName={activity.name}
            entry={entry}
            supportedMeasurements={activity.supportedMeasurements}
            onChangeField={(field, value) => onUpdateCardioField(entry.plannedOptionId, field, value)}
            onToggleComplete={() => onToggleCardioComplete(entry.plannedOptionId)}
          />
        );
      })}

      <Card>
        <Button label="Complete Workout" onPress={onComplete} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  title: { color: colors.text, fontSize: 20, fontWeight: '800' },
  subtle: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
});
