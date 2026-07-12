import type { CardioActivity } from '../../types/training';

export const conditioningActivities: CardioActivity[] = [
  {
    id: 'sled-pushes',
    name: 'Sled Pushes',
    description: 'Loaded sled push repeats for full-body conditioning and leg drive.',
    category: 'sled',
    equipment: ['sled'],
    supportedMeasurements: ['rounds', 'distance'],
    supportedIntensities: ['hard', 'hiit', 'max-effort'],
    defaultMeasurement: 'rounds',
    defaultRounds: 6,
    defaultRoundDurationSeconds: 30,
    defaultRestSeconds: 90,
    trainingGoals: ['conditioning', 'athleticism', 'fat-loss'],
    difficulty: 'intermediate',
  },
  {
    id: 'farmer-carries',
    name: 'Farmer Carries',
    description: 'Loaded carry repeats for grip, full-body tension, and conditioning.',
    category: 'carries',
    equipment: ['dumbbell', 'kettlebell'],
    supportedMeasurements: ['rounds', 'distance'],
    supportedIntensities: ['moderate', 'hard'],
    defaultMeasurement: 'rounds',
    defaultRounds: 5,
    defaultRoundDurationSeconds: 40,
    defaultRestSeconds: 60,
    trainingGoals: ['conditioning', 'athleticism'],
    difficulty: 'beginner',
  },
];
