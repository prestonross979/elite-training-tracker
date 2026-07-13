import { buildTrainingPlan, buildWorkoutDay } from './helpers';

const chest = buildWorkoutDay({
  id: 'bro-split-chest',
  name: 'Chest',
  description: 'Dedicated chest hypertrophy day.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'upper-chest'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 55,
  order: 1,
  exercises: [
    { exerciseId: 'barbell-bench-press', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'incline-dumbbell-press', sets: 4, repRange: '8-10', restSeconds: 100 },
    { exerciseId: 'machine-chest-press', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'cable-chest-fly', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'dip', sets: 3, repRange: '8-12', restSeconds: 90 },
  ],
});

const back = buildWorkoutDay({
  id: 'bro-split-back',
  name: 'Back',
  description: 'Dedicated back hypertrophy day.',
  type: 'hypertrophy',
  targetMuscles: ['back', 'lats', 'upper-back'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 55,
  order: 2,
  exercises: [
    { exerciseId: 'barbell-row', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'lat-pulldown', sets: 4, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'seated-cable-row', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'machine-pullover', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'straight-arm-pulldown', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const shoulders = buildWorkoutDay({
  id: 'bro-split-shoulders',
  name: 'Shoulders',
  description: 'Dedicated shoulder hypertrophy day.',
  type: 'hypertrophy',
  targetMuscles: ['shoulders', 'side-delts', 'rear-delts'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 50,
  order: 3,
  exercises: [
    { exerciseId: 'barbell-overhead-press', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'dumbbell-lateral-raise', sets: 4, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'cable-lateral-raise', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'reverse-pec-deck', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'face-pull', sets: 3, repRange: '12-20', restSeconds: 60 },
  ],
});

const arms = buildWorkoutDay({
  id: 'bro-split-arms',
  name: 'Arms',
  description: 'Dedicated biceps and triceps hypertrophy day.',
  type: 'hypertrophy',
  targetMuscles: ['biceps', 'triceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 50,
  order: 4,
  exercises: [
    { exerciseId: 'ez-bar-curl', sets: 4, repRange: '8-12', restSeconds: 75 },
    { exerciseId: 'close-grip-bench-press', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'incline-dumbbell-curl', sets: 3, repRange: '10-15', restSeconds: 60 },
    { exerciseId: 'rope-triceps-pushdown', sets: 3, repRange: '10-15', restSeconds: 60 },
    { exerciseId: 'hammer-curl', sets: 3, repRange: '10-12', restSeconds: 60 },
    { exerciseId: 'skull-crusher', sets: 3, repRange: '8-12', restSeconds: 75 },
  ],
});

const legs = buildWorkoutDay({
  id: 'bro-split-legs',
  name: 'Legs',
  description: 'Dedicated leg hypertrophy day.',
  type: 'hypertrophy',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 65,
  order: 5,
  exercises: [
    { exerciseId: 'barbell-back-squat', sets: 4, repRange: '6-10', restSeconds: 150 },
    { exerciseId: 'leg-press', sets: 3, repRange: '10-15', restSeconds: 100 },
    { exerciseId: 'romanian-deadlift', sets: 3, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'leg-extension', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'lying-leg-curl', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'standing-calf-raise', sets: 4, repRange: '10-15', restSeconds: 60 },
  ],
});

const rest = buildWorkoutDay({
  id: 'bro-split-rest',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 6,
});

export const broSplitPlan = buildTrainingPlan({
  id: 'bro-split',
  name: 'Bro Split',
  description: 'A classic 6-day body-part split dedicating one day to each major muscle group.',
  difficulty: 'beginner',
  trainingGoals: ['hypertrophy'],
  daysPerCycle: 6,
  recommendedTrainingDaysPerWeek: 5,
  workoutDays: [chest, back, shoulders, arms, legs, rest],
});
