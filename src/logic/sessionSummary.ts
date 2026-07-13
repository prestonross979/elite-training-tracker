import type { WorkoutSession, SessionCardioEntry } from '../storage/workoutSession';
import type { PlannedExercise } from '../types/training';
import type { ExerciseLog } from '../logic';
import { getExerciseById } from '../data/exercises';
import { getCardioActivityById } from '../data/cardio';
import { getPlannedExerciseRecommendation } from './planProgression';

export type SessionSummary = {
  workoutName: string;
  totalExercises: number;
  completedExercises: number;
  totalCompletedSets: number;
  cardio: { name: string; detail: string; completed: boolean }[];
  recommendations: { exerciseName: string; text: string }[];
  nextWorkoutName?: string;
};

function describeCardioEntry(entry: SessionCardioEntry): string {
  const parts: string[] = [];
  if (entry.durationMinutes) parts.push(`${entry.durationMinutes} min`);
  if (entry.distanceMiles) parts.push(`${entry.distanceMiles} mi`);
  if (entry.rounds) parts.push(`${entry.rounds} rounds${entry.roundDurationSeconds ? ` x ${entry.roundDurationSeconds}s` : ''}`);
  if (entry.calories) parts.push(`${entry.calories} cal`);
  if (entry.steps) parts.push(`${entry.steps} steps`);
  return parts.length > 0 ? parts.join(' • ') : 'Logged';
}

export function buildSessionSummary(session: WorkoutSession, nextWorkoutName?: string): SessionSummary {
  let totalCompletedSets = 0;
  let completedExercises = 0;
  const recommendations: SessionSummary['recommendations'] = [];

  session.exercises.forEach((sessionExercise, index) => {
    const exercise = getExerciseById(sessionExercise.exerciseId);
    if (!exercise) return;

    if (sessionExercise.completed) completedExercises += 1;
    totalCompletedSets += sessionExercise.sets.filter((set) => set.weight || set.reps).length;

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

    recommendations.push({ exerciseName: exercise.name, text: getPlannedExerciseRecommendation(exercise, planned, log) });
  });

  const cardio = session.cardio
    .map((entry) => {
      const activity = getCardioActivityById(entry.cardioActivityId);
      if (!activity) return null;
      return { name: activity.name, detail: describeCardioEntry(entry), completed: entry.completed };
    })
    .filter((entry): entry is { name: string; detail: string; completed: boolean } => Boolean(entry));

  return {
    workoutName: session.workoutName,
    totalExercises: session.exercises.length,
    completedExercises,
    totalCompletedSets,
    cardio,
    recommendations,
    nextWorkoutName,
  };
}

// Reused when writing a session into the shared history list so cardio work
// is visible there too without changing the existing history item schema.
export function summarizeCardioForHistoryNotes(session: WorkoutSession): string {
  const lines = session.cardio
    .map((entry) => {
      const activity = getCardioActivityById(entry.cardioActivityId);
      if (!activity) return null;
      return `${activity.name} — ${describeCardioEntry(entry)}`;
    })
    .filter((line): line is string => Boolean(line));

  return lines.length > 0 ? `Cardio: ${lines.join('; ')}` : '';
}
