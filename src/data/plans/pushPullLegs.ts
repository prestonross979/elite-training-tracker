import { buildTrainingPlan, buildWorkoutDay } from './helpers';

const push = buildWorkoutDay({
  id: 'ppl-push',
  name: 'Push',
  description: 'Chest, shoulders, and triceps.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'upper-chest', 'shoulders', 'triceps'],
  trainingGoals: ['hypertrophy', 'strength'],
  estimatedDurationMinutes: 60,
  order: 1,
  exercises: [
    { exerciseId: 'barbell-bench-press', sets: 4, repRange: '5-8', restSeconds: 150 },
    { exerciseId: 'seated-dumbbell-shoulder-press', sets: 3, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'incline-dumbbell-press', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'cable-lateral-raise', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'rope-triceps-pushdown', sets: 3, repRange: '10-15', restSeconds: 60 },
    { exerciseId: 'overhead-cable-triceps-extension', sets: 3, repRange: '10-12', restSeconds: 60 },
  ],
});

const pull = buildWorkoutDay({
  id: 'ppl-pull',
  name: 'Pull',
  description: 'Back and biceps.',
  type: 'hypertrophy',
  targetMuscles: ['back', 'lats', 'upper-back', 'biceps'],
  trainingGoals: ['hypertrophy', 'strength'],
  estimatedDurationMinutes: 60,
  order: 2,
  exercises: [
    { exerciseId: 'barbell-row', sets: 4, repRange: '6-8', restSeconds: 150 },
    { exerciseId: 'lat-pulldown', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'seated-cable-row', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'face-pull', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'ez-bar-curl', sets: 3, repRange: '8-12', restSeconds: 75 },
    { exerciseId: 'hammer-curl', sets: 3, repRange: '10-12', restSeconds: 60 },
  ],
});

const legs = buildWorkoutDay({
  id: 'ppl-legs',
  name: 'Legs',
  description: 'Quadriceps, hamstrings, glutes, and calves.',
  type: 'hypertrophy',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  trainingGoals: ['hypertrophy', 'strength'],
  estimatedDurationMinutes: 65,
  order: 3,
  exercises: [
    { exerciseId: 'barbell-back-squat', sets: 4, repRange: '6-8', restSeconds: 180 },
    { exerciseId: 'romanian-deadlift', sets: 3, repRange: '8-10', restSeconds: 150 },
    { exerciseId: 'leg-press', sets: 3, repRange: '10-12', restSeconds: 120 },
    { exerciseId: 'leg-extension', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'seated-leg-curl', sets: 3, repRange: '10-12', restSeconds: 75 },
    { exerciseId: 'standing-calf-raise', sets: 4, repRange: '10-15', restSeconds: 60 },
  ],
});

const rest = buildWorkoutDay({
  id: 'ppl-rest',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 4,
});

export const pushPullLegsPlan = buildTrainingPlan({
  id: 'push-pull-legs',
  name: 'Push / Pull / Legs',
  description: 'A classic 4-day rotation that splits training by movement pattern for balanced hypertrophy and strength.',
  difficulty: 'intermediate',
  trainingGoals: ['hypertrophy', 'strength'],
  daysPerCycle: 4,
  recommendedTrainingDaysPerWeek: 3,
  workoutDays: [push, pull, legs, rest],
});
