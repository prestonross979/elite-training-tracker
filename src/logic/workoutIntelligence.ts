import type { EquipmentType, Exercise, MovementPattern, MuscleGroup, PlannedExercise, WorkoutDay } from '../types/training';
import { getExerciseById, exercises as allExercises } from '../data/exercises';
import { getCardioActivityById } from '../data/cardio';

function plannedExercisesToExercises(planned: PlannedExercise[]): Exercise[] {
  return planned
    .map((entry) => getExerciseById(entry.exerciseId))
    .filter((exercise): exercise is Exercise => Boolean(exercise));
}

export function countExercisesByMovementPattern(day: WorkoutDay): Partial<Record<MovementPattern, number>> {
  const counts: Partial<Record<MovementPattern, number>> = {};

  plannedExercisesToExercises(day.exercises).forEach((exercise) => {
    counts[exercise.movementPattern] = (counts[exercise.movementPattern] ?? 0) + 1;
  });

  return counts;
}

export function lacksMovementPattern(day: WorkoutDay, pattern: MovementPattern): boolean {
  return !plannedExercisesToExercises(day.exercises).some((exercise) => exercise.movementPattern === pattern);
}

export function lacksHorizontalPush(day: WorkoutDay): boolean {
  return lacksMovementPattern(day, 'horizontal-push');
}

export function lacksVerticalPull(day: WorkoutDay): boolean {
  return lacksMovementPattern(day, 'vertical-pull');
}

export function countPlannedSetsByMuscleGroup(day: WorkoutDay): Partial<Record<MuscleGroup, number>> {
  const counts: Partial<Record<MuscleGroup, number>> = {};

  day.exercises.forEach((planned) => {
    const exercise = getExerciseById(planned.exerciseId);
    if (!exercise) return;

    exercise.primaryMuscles.forEach((muscle) => {
      counts[muscle] = (counts[muscle] ?? 0) + planned.sets;
    });
  });

  return counts;
}

export function findDuplicateMovementPatterns(day: WorkoutDay): MovementPattern[] {
  const counts = countExercisesByMovementPattern(day);

  return (Object.keys(counts) as MovementPattern[]).filter((pattern) => (counts[pattern] ?? 0) > 1);
}

export type IdValidationResult = { valid: string[]; invalid: string[] };

export function validateExerciseIds(exerciseIds: string[]): IdValidationResult {
  const valid: string[] = [];
  const invalid: string[] = [];

  exerciseIds.forEach((id) => {
    if (getExerciseById(id)) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  });

  return { valid, invalid };
}

export function validateCardioIds(cardioActivityIds: string[]): IdValidationResult {
  const valid: string[] = [];
  const invalid: string[] = [];

  cardioActivityIds.forEach((id) => {
    if (getCardioActivityById(id)) {
      valid.push(id);
    } else {
      invalid.push(id);
    }
  });

  return { valid, invalid };
}

export type AlternativeRecommendationOptions = {
  availableEquipment?: EquipmentType[];
  limit?: number;
};

// Scores candidates by movement-pattern match, shared primary muscles, and category match.
export function recommendAlternativeExercises(exerciseId: string, options: AlternativeRecommendationOptions = {}): Exercise[] {
  const source = getExerciseById(exerciseId);
  if (!source) return [];

  const { availableEquipment, limit = 5 } = options;

  const scored = allExercises
    .filter((candidate) => candidate.id !== source.id)
    .filter((candidate) => !availableEquipment || candidate.equipment.some((item) => availableEquipment.includes(item)))
    .map((candidate) => {
      let score = 0;

      if (candidate.movementPattern === source.movementPattern) score += 2;
      if (candidate.category === source.category) score += 1;

      const sharedPrimaryMuscles = candidate.primaryMuscles.filter((muscle) => source.primaryMuscles.includes(muscle));
      score += sharedPrimaryMuscles.length;

      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((entry) => entry.candidate);
}
