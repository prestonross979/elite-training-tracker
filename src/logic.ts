import { Exercise, ExerciseType } from './program';

export function parseRepRange(repRange: string): { min: number; max: number } | null {
  const match = String(repRange).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;
  return { min: Number(match[1]), max: Number(match[2]) };
}

export function getIncrement(type: ExerciseType): string {
  switch (type) {
    case 'upper-compound':
      return '+5 lb next session';
    case 'lower-compound':
      return '+10 lb next session';
    case 'lower-machine':
      return '+10–20 lb next session';
    case 'machine':
      return '+5–10 lb next session';
    case 'isolation':
      return '+2.5–5 lb next session';
    case 'bodyweight':
      return 'add reps first, then load';
    default:
      return 'keep it easy';
  }
}

export type SetLog = { weight: string; reps: string };
export type ExerciseLog = { name: string; completed: boolean; notes: string; sets: SetLog[] };

export function getRecommendation(exercise: Exercise, log: ExerciseLog): string {
  if (exercise.type === 'recovery') return 'Keep this easy and consistent.';
  const range = parseRepRange(exercise.repRange);
  if (!range) return 'Log performance and stay controlled.';

  const reps = log.sets.map((s) => Number(s.reps)).filter((n) => !Number.isNaN(n) && n > 0);
  if (!reps.length) return `Start with a controlled weight for ${exercise.repRange}.`;

  const fullLogged = reps.length >= exercise.sets;
  const allTop = fullLogged && reps.every((r) => r >= range.max);
  const anyLow = reps.some((r) => r < range.min);

  if (allTop) return `Increase: ${getIncrement(exercise.type)}.`;
  if (anyLow) return 'Keep weight the same and clean up reps.';
  return 'Hold weight and add 1 rep where you can.';
}

export function todayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}
