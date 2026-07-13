import type { Exercise, EquipmentType, MuscleGroup } from '../../types/training';
import { chestExercises } from './chest';
import { backExercises } from './back';
import { shoulderExercises } from './shoulders';
import { armExercises } from './arms';
import { legExercises } from './legs';
import { coreExercises } from './core';
import { fullBodyExercises } from './fullBody';

export const exercises: Exercise[] = [
  ...chestExercises,
  ...backExercises,
  ...shoulderExercises,
  ...armExercises,
  ...legExercises,
  ...coreExercises,
  ...fullBodyExercises,
];

if (__DEV__) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  exercises.forEach((exercise) => {
    if (seen.has(exercise.id)) {
      duplicates.add(exercise.id);
    }
    seen.add(exercise.id);
  });

  if (duplicates.size > 0) {
    console.warn(`[exercises] Duplicate exercise IDs found: ${Array.from(duplicates).join(', ')}`);
  }

  exercises.forEach((exercise) => {
    exercise.alternativeExerciseIds.forEach((altId) => {
      if (!seen.has(altId)) {
        console.warn(`[exercises] "${exercise.id}" references unknown alternative exercise "${altId}"`);
      }
    });
  });
}

const exerciseById = new Map(exercises.map((exercise) => [exercise.id, exercise]));

export function getExerciseById(id: string): Exercise | undefined {
  return exerciseById.get(id);
}

export function getExercisesByMuscle(muscle: MuscleGroup): Exercise[] {
  return exercises.filter(
    (exercise) => exercise.primaryMuscles.includes(muscle) || exercise.secondaryMuscles.includes(muscle),
  );
}

export function getExercisesByEquipment(equipment: EquipmentType): Exercise[] {
  return exercises.filter((exercise) => exercise.equipment.includes(equipment));
}

export function getExerciseAlternatives(exerciseId: string): Exercise[] {
  const exercise = getExerciseById(exerciseId);

  if (!exercise) {
    return [];
  }

  return exercise.alternativeExerciseIds
    .map(getExerciseById)
    .filter((alternative): alternative is Exercise => Boolean(alternative));
}
