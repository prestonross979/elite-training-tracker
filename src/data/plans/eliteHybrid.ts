import { buildTrainingPlan, buildWorkoutDay } from './helpers';

const upperStrength = buildWorkoutDay({
  id: 'elite-hybrid-day-1-upper-strength',
  name: 'Upper Strength',
  shortName: 'Upper Strength',
  description: 'Heavy pressing and pulling to build upper-body strength.',
  type: 'strength',
  targetMuscles: ['chest', 'upper-chest', 'shoulders', 'lats', 'back', 'triceps'],
  trainingGoals: ['strength', 'hypertrophy'],
  estimatedDurationMinutes: 65,
  order: 1,
  exercises: [
    { exerciseId: 'incline-barbell-bench-press', sets: 4, repRange: '4-6', restSeconds: 150 },
    { exerciseId: 'machine-shoulder-press', sets: 3, repRange: '6-8', restSeconds: 120 },
    { exerciseId: 'pull-up', sets: 4, repRange: '6-8', restSeconds: 150 },
    { exerciseId: 'chest-supported-row', sets: 3, repRange: '6-8', restSeconds: 120 },
    { exerciseId: 'close-grip-bench-press', sets: 3, repRange: '6-8', restSeconds: 120 },
    { exerciseId: 'cable-crunch', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const lowerStrengthConditioning = buildWorkoutDay({
  id: 'elite-hybrid-day-2-lower-strength-conditioning',
  name: 'Lower Strength + Short Conditioning',
  shortName: 'Lower Strength',
  description: 'Heavy squatting and hinging followed by a short optional conditioning finisher.',
  type: 'hybrid',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves'],
  trainingGoals: ['strength', 'conditioning'],
  estimatedDurationMinutes: 70,
  order: 2,
  exercises: [
    { exerciseId: 'barbell-back-squat', sets: 4, repRange: '4-6', restSeconds: 180 },
    { exerciseId: 'romanian-deadlift', sets: 3, repRange: '6-8', restSeconds: 150 },
    { exerciseId: 'bulgarian-split-squat', sets: 3, repRange: '8-10', restSeconds: 90 },
    { exerciseId: 'seated-leg-curl', sets: 3, repRange: '10-12', restSeconds: 75 },
    { exerciseId: 'standing-calf-raise', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
  cardioGroups: [
    {
      id: 'elite-hybrid-day-2-conditioning',
      title: 'Short Conditioning (optional)',
      description: 'Pick one short conditioning finisher to close out the session.',
      minimumSelections: 0,
      maximumSelections: 1,
      options: [
        { cardioActivityId: 'heavy-bag-rounds', intensity: 'hard', measurement: 'rounds', rounds: 4, roundDurationSeconds: 120, restSeconds: 45 },
        { cardioActivityId: 'stairmaster', intensity: 'moderate', measurement: 'duration', durationMinutes: 12 },
        { cardioActivityId: 'sled-pushes', intensity: 'hard', measurement: 'rounds', rounds: 4, roundDurationSeconds: 30, restSeconds: 90 },
        { cardioActivityId: 'tempo-run', intensity: 'tempo', measurement: 'duration', durationMinutes: 12 },
      ],
    },
  ],
});

const zone2ActiveRecovery = buildWorkoutDay({
  id: 'elite-hybrid-day-3-zone2-recovery',
  name: 'Zone 2 / Active Recovery',
  shortName: 'Zone 2',
  description: 'Choose one easy aerobic option to promote recovery while maintaining aerobic base.',
  type: 'cardio',
  targetMuscles: ['full-body'],
  trainingGoals: ['endurance', 'recovery'],
  estimatedDurationMinutes: 35,
  order: 3,
  cardioGroups: [
    {
      id: 'elite-hybrid-day-3-options',
      title: 'Choose Your Zone 2 Session',
      description: 'Any of these keep heart rate in an easy, conversational range.',
      minimumSelections: 1,
      maximumSelections: 1,
      options: [
        { cardioActivityId: 'zone-2-run', intensity: 'zone-2', measurement: 'duration', durationMinutes: 35 },
        { cardioActivityId: 'incline-treadmill-walk', intensity: 'moderate', measurement: 'duration', durationMinutes: 40 },
        { cardioActivityId: 'outdoor-walk', intensity: 'easy', measurement: 'duration', durationMinutes: 45 },
        { cardioActivityId: 'stationary-bike', intensity: 'zone-2', measurement: 'duration', durationMinutes: 35 },
        { cardioActivityId: 'rowing-machine', intensity: 'zone-2', measurement: 'duration', durationMinutes: 25 },
        { cardioActivityId: 'elliptical', intensity: 'zone-2', measurement: 'duration', durationMinutes: 30 },
      ],
    },
  ],
});

const pushHypertrophy = buildWorkoutDay({
  id: 'elite-hybrid-day-4-push-hypertrophy',
  name: 'Push Hypertrophy',
  shortName: 'Push',
  description: 'Higher-volume pressing work targeting the upper chest, side delts, and triceps.',
  type: 'hypertrophy',
  targetMuscles: ['upper-chest', 'chest', 'side-delts', 'triceps'],
  trainingGoals: ['hypertrophy'],
  estimatedDurationMinutes: 60,
  order: 4,
  exercises: [
    { exerciseId: 'incline-dumbbell-press', sets: 4, repRange: '8-10', restSeconds: 120 },
    { exerciseId: 'incline-machine-chest-press', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'machine-chest-press', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'pec-deck', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'cable-lateral-raise', sets: 4, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'overhead-cable-triceps-extension', sets: 3, repRange: '10-12', restSeconds: 60 },
    { exerciseId: 'rope-triceps-pushdown', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
});

const pullHypertrophyConditioning = buildWorkoutDay({
  id: 'elite-hybrid-day-5-pull-hypertrophy-conditioning',
  name: 'Pull Hypertrophy + Conditioning',
  shortName: 'Pull',
  description: 'Higher-volume pulling work for the lats, upper back, rear delts, and biceps, finished with conditioning.',
  type: 'hybrid',
  targetMuscles: ['lats', 'upper-back', 'rear-delts', 'biceps'],
  trainingGoals: ['hypertrophy', 'conditioning'],
  estimatedDurationMinutes: 65,
  order: 5,
  exercises: [
    { exerciseId: 'lat-pulldown', sets: 4, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'machine-pullover', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'seated-cable-row', sets: 3, repRange: '8-12', restSeconds: 90 },
    { exerciseId: 'wide-grip-row', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'reverse-pec-deck', sets: 3, repRange: '12-20', restSeconds: 60 },
    { exerciseId: 'preacher-curl', sets: 3, repRange: '8-12', restSeconds: 75 },
    { exerciseId: 'bayesian-cable-curl', sets: 3, repRange: '10-15', restSeconds: 60 },
  ],
  cardioGroups: [
    {
      id: 'elite-hybrid-day-5-conditioning',
      title: 'Conditioning Finisher',
      description: 'Pick one conditioning option to close out the session.',
      minimumSelections: 0,
      maximumSelections: 1,
      options: [
        { cardioActivityId: 'heavy-bag-rounds', intensity: 'hard', measurement: 'rounds', rounds: 4, roundDurationSeconds: 120, restSeconds: 45 },
        { cardioActivityId: 'boxing-technique-rounds', intensity: 'moderate', measurement: 'rounds', rounds: 4, roundDurationSeconds: 180, restSeconds: 60 },
        { cardioActivityId: 'jump-rope', intensity: 'hard', measurement: 'rounds', rounds: 6, roundDurationSeconds: 120, restSeconds: 45 },
        { cardioActivityId: 'stairmaster', intensity: 'moderate', measurement: 'duration', durationMinutes: 12 },
        { cardioActivityId: 'sprint-intervals', intensity: 'hiit', measurement: 'rounds', rounds: 6, roundDurationSeconds: 20, restSeconds: 60 },
      ],
    },
  ],
});

const legsHypertrophyCardio = buildWorkoutDay({
  id: 'elite-hybrid-day-6-legs-hypertrophy',
  name: 'Legs Hypertrophy + Optional Cardio',
  shortName: 'Legs',
  description: 'Higher-volume lower-body work with an easy optional cardio finisher.',
  type: 'hybrid',
  targetMuscles: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'core'],
  trainingGoals: ['hypertrophy', 'conditioning'],
  estimatedDurationMinutes: 65,
  order: 6,
  exercises: [
    { exerciseId: 'hack-squat', sets: 4, repRange: '8-12', restSeconds: 120 },
    { exerciseId: 'leg-press', sets: 3, repRange: '10-15', restSeconds: 100 },
    { exerciseId: 'leg-extension', sets: 3, repRange: '12-15', restSeconds: 60 },
    { exerciseId: 'lying-leg-curl', sets: 3, repRange: '10-15', restSeconds: 75 },
    { exerciseId: 'bulgarian-split-squat', sets: 3, repRange: '10-12', restSeconds: 90 },
    { exerciseId: 'seated-calf-raise', sets: 4, repRange: '10-20', restSeconds: 60 },
    { exerciseId: 'hanging-leg-raise', sets: 3, repRange: '8-15', restSeconds: 60 },
  ],
  cardioGroups: [
    {
      id: 'elite-hybrid-day-6-cardio',
      title: 'Optional Easy Cardio',
      description: 'Keep this easy - the goal is blood flow, not fatigue.',
      minimumSelections: 0,
      maximumSelections: 1,
      options: [
        { cardioActivityId: 'outdoor-walk', intensity: 'easy', measurement: 'duration', durationMinutes: 20 },
        { cardioActivityId: 'incline-treadmill-walk', intensity: 'easy', measurement: 'duration', durationMinutes: 20 },
        { cardioActivityId: 'stationary-bike', intensity: 'easy', measurement: 'duration', durationMinutes: 15 },
        { cardioActivityId: 'rowing-machine', intensity: 'recovery', measurement: 'duration', durationMinutes: 12 },
      ],
    },
  ],
});

const restOrRecovery = buildWorkoutDay({
  id: 'elite-hybrid-day-7-rest-recovery',
  name: 'Rest or Recovery Walking',
  shortName: 'Rest',
  description: 'A full rest day, or an easy walk if you want to stay moving. Mobility work can be added here in a future update.',
  type: 'rest',
  targetMuscles: [],
  trainingGoals: ['recovery'],
  estimatedDurationMinutes: 20,
  order: 7,
  cardioGroups: [
    {
      id: 'elite-hybrid-day-7-options',
      title: 'Optional Recovery Walk',
      description: 'Complete rest is also a perfectly valid choice today.',
      minimumSelections: 0,
      maximumSelections: 1,
      options: [
        { cardioActivityId: 'recovery-walk', intensity: 'recovery', measurement: 'duration', durationMinutes: 20 },
        { cardioActivityId: 'outdoor-walk', intensity: 'recovery', measurement: 'duration', durationMinutes: 25 },
        { cardioActivityId: 'treadmill-walk', intensity: 'recovery', measurement: 'duration', durationMinutes: 20 },
      ],
    },
  ],
});

export const eliteHybridPlan = buildTrainingPlan({
  id: 'elite-hybrid',
  name: 'Elite Hybrid',
  description:
    'A 7-day rotation combining strength, hypertrophy, aerobic conditioning, and higher-intensity conditioning with built-in walking and recovery work. The featured program of Elite Gym Trainer.',
  difficulty: 'intermediate',
  trainingGoals: ['strength', 'hypertrophy', 'endurance', 'conditioning', 'athleticism'],
  daysPerCycle: 7,
  recommendedTrainingDaysPerWeek: 6,
  isFeatured: true,
  workoutDays: [
    upperStrength,
    lowerStrengthConditioning,
    zone2ActiveRecovery,
    pushHypertrophy,
    pullHypertrophyConditioning,
    legsHypertrophyCardio,
    restOrRecovery,
  ],
});
