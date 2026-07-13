import { buildTrainingPlan, buildWorkoutDay } from './helpers';

const upperA = buildWorkoutDay({
  id: 'upper-lower-upper-a',
  name: 'Upper A',
  description: 'Upper-body strength and hypertrophy.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  trainingGoals: ['hypertrophy', 'strength'],
  estimatedDurationMinutes: 60,
  order: 1,
  exercises: [
    { exerciseId: 'barbell-bench-press', sets: 4, repRange: '5-8', restSeconds: 150 },
    { exerciseId: 'barbell-row', sets: 4, repRange: '6-8', restSeconds: 150 },
    { exerciseId: 'machine-shoulder-press', sets: 3, repRange: '8-10', restSeconds: 90 },
    { exerciseId: 'lat-pulldown', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'ez-bar-curl', sets: 3, repRange: '8-12', restSeconds: 60 },
    { exerciseId: 'rope-triceps-pushdown', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const lowerA = buildWorkoutDay({
  id: 'upper-lower-lower-a',
  name: 'Lower A',
  description: 'Squat-focused lower-body strength.',
  type: 'strength',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  trainingGoals: ['strength', 'hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 2,
  exercises: [
    { exerciseId: 'barbell-back-squat', sets: 4, repRange: '5-8', restSeconds: 180 },
    { exerciseId: 'romanian-deadlift', sets: 3, repRange: '8-10', restSeconds: 150 },
    { exerciseId: 'leg-press', sets: 3, repRange: '10-12', restSeconds: 120 },
    { exerciseId: 'seated-leg-curl', sets: 3, repRange: '10-12', restSeconds: 75 },
    { exerciseId: 'standing-calf-raise', sets: 4, repRange: '10-15', restSeconds: 60 },
  ],
});

const restA = buildWorkoutDay({
  id: 'upper-lower-rest-a',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 3,
});

const upperB = buildWorkoutDay({
  id: 'upper-lower-upper-b',
  name: 'Upper B',
  description: 'Upper-body hypertrophy with different exercise selection than Upper A.',
  type: 'hypertrophy',
  targetMuscles: ['chest', 'back', 'shoulders', 'biceps', 'triceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 4,
  exercises: [
    { exerciseId: 'incline-dumbbell-press', sets: 4, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'seated-cable-row', sets: 4, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'dumbbell-lateral-raise', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'machine-pullover', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'hammer-curl', sets: 3, repRange: '10-12', restSeconds: 60 },
    { exerciseId: 'skull-crusher', sets: 3, repRange: '8-12', restSeconds: 75 },
  ],
});

const lowerB = buildWorkoutDay({
  id: 'upper-lower-lower-b',
  name: 'Lower B',
  description: 'Hinge-focused lower-body hypertrophy.',
  type: 'hypertrophy',
  targetMuscles: ['hamstrings', 'glutes', 'quadriceps', 'calves', 'core'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 5,
  exercises: [
    { exerciseId: 'hack-squat', sets: 4, repRange: '8-12', restSeconds: 120 },
    { exerciseId: 'bulgarian-split-squat', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'lying-leg-curl', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'leg-extension', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'seated-calf-raise', sets: 4, repRange: '10-20', restSeconds: 60 },
    { exerciseId: 'cable-crunch', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const restB = buildWorkoutDay({
  id: 'upper-lower-rest-b',
  name: 'Rest',
  description: 'Full rest day.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  order: 6,
});

export const upperLowerPlan = buildTrainingPlan({
  id: 'upper-lower',
  name: 'Upper / Lower',
  description: 'A 6-day cycle alternating upper- and lower-body sessions with a rest day after each pair.',
  difficulty: 'intermediate',
  trainingGoals: ['strength', 'hypertrophy'],
  daysPerCycle: 6,
  recommendedTrainingDaysPerWeek: 4,
  workoutDays: [upperA, lowerA, restA, upperB, lowerB, restB],
});
