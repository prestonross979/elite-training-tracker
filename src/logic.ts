import { Exercise, ExerciseType } from './program';

export function parseRepRange(repRange: string): { min: number; max: number } | null {
  const match = String(repRange).match(/(\d+)\s*-\s*(\d+)/);
  if (!match) return null;

  return {
    min: Number(match[1]),
    max: Number(match[2]),
  };
}

export function getIncrement(type: ExerciseType): string {
  switch (type) {
    case 'upper-compound':
      return '+5 lb';
    case 'lower-compound':
      return '+10 lb';
    case 'lower-machine':
      return '+10–20 lb';
    case 'machine':
      return '+5–10 lb';
    case 'isolation':
      return '+2.5–5 lb';
    case 'bodyweight':
      return 'add reps first, then add load';
    default:
      return 'a small amount';
  }
}

export type SetLog = {
  weight: string;
  reps: string;
};

export type ExerciseLog = {
  name: string;
  completed: boolean;
  notes: string;
  sets: SetLog[];
};

export function getRecommendation(exercise: Exercise, log: ExerciseLog): string {
  if (exercise.type === 'recovery') {
    return 'Keep this easy and consistent.';
  }

  const range = parseRepRange(exercise.repRange);

  if (!range) {
    return 'Log performance and stay controlled.';
  }

  const reps = log.sets
    .map((set) => Number(set.reps))
    .filter((rep) => !Number.isNaN(rep) && rep > 0);

  if (reps.length === 0) {
    return `Start with a controlled weight for ${exercise.repRange}.`;
  }

  const latestRep = reps[reps.length - 1];
  const latestSetNumber = reps.length;
  const isFinalSet = latestSetNumber >= exercise.sets;
  const increment = getIncrement(exercise.type);

  if (latestRep < range.min) {
    return isFinalSet
      ? `Final set fell below range. Drop the weight next session or rest longer before this movement.`
      : `Below target. Rest longer or drop weight for the next set.`;
  }

  if (latestRep >= range.max + 5) {
    return isFinalSet
      ? `Final set was way above range. Increase more aggressively next session. Normal jump: ${increment}.`
      : `Way above target. Increase weight for the next set. Normal jump: ${increment}.`;
  }

  if (latestRep >= range.max) {
    return isFinalSet
      ? `Final set hit the top of the range. Increase weight next session by ${increment}.`
      : `Good job. You hit your target. Increase weight for the next set by ${increment}.`;
  }

  return `Good set. Stay at this weight and try to reach ${range.max} reps.`;
}

export function todayName(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' });
}