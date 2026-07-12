import { buildTrainingPlan, buildWorkoutDay } from './helpers';

const upper = buildWorkoutDay({
  id: 'four-day-hyp-upper',
  name: 'Upper',
  description: 'Balanced upper-body hypertrophy.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 1,
  exercises: [
    { exerciseId: 'dumbbell-bench-press', sets: 4, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'chest-supported-row', sets: 4, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'machine-shoulder-press', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'lat-pulldown', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'cable-curl', sets: 3, repRange: '10-15', restSeconds: 60 },
    { exerciseId: 'rope-triceps-pushdown', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const lower = buildWorkoutDay({
  id: 'four-day-hyp-lower',
  name: 'Lower',
  description: 'Balanced lower-body hypertrophy.',
  type: 'hypertrophy',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 2,
  exercises: [
    { exerciseId: 'hack-squat', sets: 4, repRange: '8-12', restSeconds: 120 },
    { exerciseId: 'romanian-deadlift', sets: 3, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'leg-extension', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'seated-leg-curl', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'standing-calf-raise', sets: 4, repRange: '10-15', restSeconds: 60 },
  ],
});

const rest1 = buildWorkoutDay({
  id: 'four-day-hyp-rest-1',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 3,
});

const push = buildWorkoutDay({
  id: 'four-day-hyp-push',
  name: 'Push',
  description: 'Chest, shoulders, and triceps focus.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'upper-chest', 'shoulders', 'triceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 4,
  exercises: [
    { exerciseId: 'incline-barbell-bench-press', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'seated-dumbbell-shoulder-press', sets: 3, repRange: '8-10', restSeconds: 90 },
    { exerciseId: 'pec-deck', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'cable-lateral-raise', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'overhead-cable-triceps-extension', sets: 3, repRange: '10-12', restSeconds: 60 },
  ],
});

const pull = buildWorkoutDay({
  id: 'four-day-hyp-pull',
  name: 'Pull',
  description: 'Back and biceps focus.',
  type: 'hypertrophy',
  targetMuscles: ['back', 'lats', 'upper-back', 'biceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 5,
  exercises: [
    { exerciseId: 'barbell-row', sets: 4, repRange: '6-10', restSeconds: 120 },
    { exerciseId: 'single-arm-lat-pulldown', sets: 3, repRange: '10-12', restSeconds: 75 },
    { exerciseId: 'reverse-pec-deck', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'incline-dumbbell-curl', sets: 3, repRange: '10-15', restSeconds: 60 },
    { exerciseId: 'hammer-curl', sets: 3, repRange: '10-12', restSeconds: 60 },
  ],
});

const legs = buildWorkoutDay({
  id: 'four-day-hyp-legs',
  name: 'Legs',
  description: 'Full lower-body volume day.',
  type: 'hypertrophy',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 65,
  order: 6,
  exercises: [
    { exerciseId: 'leg-press', sets: 4, repRange: '10-15', restSeconds: 100 },
    { exerciseId: 'bulgarian-split-squat', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'lying-leg-curl', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'seated-calf-raise', sets: 4, repRange: '10-20', restSeconds: 60 },
    { exerciseId: 'hanging-leg-raise', sets: 3, repRange: '8-15', restSeconds: 60 },
  ],
});

const rest2 = buildWorkoutDay({
  id: 'four-day-hyp-rest-2',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 7,
});

export const fourDayHypertrophyPlan = buildTrainingPlan({
  id: 'four-day-hypertrophy',
  name: 'Four-Day Hypertrophy',
  description: 'A 7-day cycle blending an upper/lower split with a push/pull/legs split for extra volume.',
  difficulty: 'intermediate',
  trainingGoals: ['hypertrophy'],
  daysPerCycle: 7,
  recommendedTrainingDaysPerWeek: 4,
  workoutDays: [upper, lower, rest1, push, pull, legs, rest2],
});
