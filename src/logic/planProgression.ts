import type { Exercise as LegacyExercise, ExerciseType } from '../program';
import { getRecommendation, ExerciseLog } from '../logic';
import type { Exercise, PlannedExercise } from '../types/training';

const LOWER_BODY_MUSCLES = new Set(['quadriceps', 'hamstrings', 'glutes', 'calves', 'adductors', 'abductors']);
const MACHINE_ONLY_EQUIPMENT = new Set(['machine', 'smith-machine']);

function mapToLegacyExerciseType(exercise: Exercise): ExerciseType {
  if (exercise.isBodyweight) return 'bodyweight';

  const isLowerBody = exercise.primaryMuscles.some((muscle) => LOWER_BODY_MUSCLES.has(muscle));
  const isMachineOnly = exercise.equipment.length > 0 && exercise.equipment.every((item) => MACHINE_ONLY_EQUIPMENT.has(item));

  if (exercise.category === 'compound') {
    if (isLowerBody) return isMachineOnly ? 'lower-machine' : 'lower-compound';
    return isMachineOnly ? 'machine' : 'upper-compound';
  }

  if (exercise.category === 'isolation' || exercise.category === 'core' || exercise.category === 'conditioning') {
    return isMachineOnly ? 'machine' : 'isolation';
  }

  return 'isolation';
}

// Reuses the app's single progression source of truth (src/logic.ts) instead of duplicating it.
export function getPlannedExerciseRecommendation(exercise: Exercise, planned: PlannedExercise, log: ExerciseLog): string {
  const legacy: LegacyExercise = {
    name: exercise.name,
    sets: planned.sets,
    repRange: planned.repRange,
    type: mapToLegacyExerciseType(exercise),
  };

  return getRecommendation(legacy, log);
}
