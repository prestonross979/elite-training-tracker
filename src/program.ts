export type ExerciseType =
  | 'upper-compound'
  | 'lower-compound'
  | 'lower-machine'
  | 'machine'
  | 'isolation'
  | 'bodyweight'
  | 'recovery';

export type Exercise = {
  name: string;
  sets: number;
  repRange: string;
  type: ExerciseType;
};

export type ProgramDay = {
  day: string;
  title: string;
  phase?: 'train' | 'recovery';
  exercises: Exercise[];
};

export const PROGRAM: ProgramDay[] = [
  {
    day: 'Monday',
    title: 'Chest + Triceps (Upper Focus)',
    phase: 'train',
    exercises: [
      { name: 'Incline Barbell Press', sets: 4, repRange: '6-8', type: 'upper-compound' },
      { name: 'Incline DB Press', sets: 3, repRange: '8-10', type: 'upper-compound' },
      { name: 'Low-to-High Cable Fly', sets: 3, repRange: '12-15', type: 'isolation' },
      { name: 'Flat Machine Press', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Overhead Tricep Extension', sets: 3, repRange: '10-12', type: 'isolation' },
      { name: 'Rope Pushdowns', sets: 3, repRange: '12-15', type: 'isolation' },
      { name: 'Hanging Leg Raises', sets: 3, repRange: '12-15', type: 'bodyweight' },
    ],
  },
  {
    day: 'Tuesday',
    title: 'Back + Biceps',
    phase: 'train',
    exercises: [
      { name: 'Pull-Ups / Lat Pulldown', sets: 4, repRange: '6-10', type: 'upper-compound' },
      { name: 'Barbell Row', sets: 4, repRange: '6-8', type: 'upper-compound' },
      { name: 'Chest Supported Row', sets: 3, repRange: '8-12', type: 'machine' },
      { name: 'Lat Pulldown', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Rear Delt Fly', sets: 4, repRange: '12-15', type: 'isolation' },
      { name: 'Barbell Curl', sets: 3, repRange: '8-10', type: 'isolation' },
      { name: 'Incline DB Curl', sets: 3, repRange: '10-12', type: 'isolation' },
    ],
  },
  {
    day: 'Wednesday',
    title: 'Rest / Active Recovery',
    phase: 'recovery',
    exercises: [
      { name: 'Walk', sets: 1, repRange: '20-30 min', type: 'recovery' },
      { name: 'Light Stretching', sets: 1, repRange: '10-15 min', type: 'recovery' },
      { name: 'Optional Plank', sets: 3, repRange: '45-60 sec', type: 'bodyweight' },
    ],
  },
  {
    day: 'Thursday',
    title: 'Legs + Abs',
    phase: 'train',
    exercises: [
      { name: 'Squat / Hack Squat', sets: 4, repRange: '6-8', type: 'lower-compound' },
      { name: 'Romanian Deadlift', sets: 3, repRange: '8-10', type: 'lower-compound' },
      { name: 'Leg Press', sets: 3, repRange: '10-12', type: 'lower-machine' },
      { name: 'Leg Curl', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Leg Extension', sets: 3, repRange: '12-15', type: 'machine' },
      { name: 'Standing Calves', sets: 4, repRange: '12-15', type: 'isolation' },
      { name: 'Cable Crunch', sets: 4, repRange: '12-15', type: 'isolation' },
    ],
  },
  {
    day: 'Friday',
    title: 'Shoulders + Arms',
    phase: 'train',
    exercises: [
      { name: 'DB Shoulder Press', sets: 4, repRange: '6-8', type: 'upper-compound' },
      { name: 'Lateral Raises', sets: 4, repRange: '12-15', type: 'isolation' },
      { name: 'Cable Lateral Raises', sets: 3, repRange: '12-15', type: 'isolation' },
      { name: 'Rear Delt Fly', sets: 3, repRange: '12-15', type: 'isolation' },
      { name: 'EZ Bar Curl', sets: 3, repRange: '8-10', type: 'isolation' },
      { name: 'Skullcrushers', sets: 3, repRange: '8-10', type: 'isolation' },
      { name: 'Hammer Curl', sets: 3, repRange: '10-12', type: 'isolation' },
      { name: 'Pushdowns', sets: 3, repRange: '10-12', type: 'isolation' },
    ],
  },
  {
    day: 'Saturday',
    title: 'Upper Pump + Weak Points',
    phase: 'train',
    exercises: [
      { name: 'Incline Machine Press', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Cable Fly', sets: 3, repRange: '12-15', type: 'isolation' },
      { name: 'Lat Pulldown', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Seated Row', sets: 3, repRange: '10-12', type: 'machine' },
      { name: 'Lateral Raises', sets: 4, repRange: '15-20', type: 'isolation' },
      { name: 'Arm Dropset (Curl)', sets: 2, repRange: 'to failure', type: 'bodyweight' },
      { name: 'Arm Dropset (Pushdown)', sets: 2, repRange: 'to failure', type: 'bodyweight' },
      { name: 'Hanging Knee Raises', sets: 3, repRange: '12-15', type: 'bodyweight' },
    ],
  },
  {
    day: 'Sunday',
    title: 'Full Rest',
    phase: 'recovery',
    exercises: [
      { name: 'Full Rest', sets: 1, repRange: 'Recover', type: 'recovery' },
      { name: 'Walk', sets: 1, repRange: 'optional 20-30 min', type: 'recovery' },
      { name: 'Mobility', sets: 1, repRange: 'optional 10 min', type: 'recovery' },
    ],
  },
];

export const PHASES = [
  { key: 'lean_bulk', label: 'Lean Bulk', target: '+0.5-1 lb/week', note: 'Prioritize performance and progressive overload.' },
  { key: 'maintenance', label: 'Maintenance', target: 'hold weight', note: 'Build skill, recover hard, maintain strength.' },
  { key: 'cut', label: 'Cut', target: '-0.5-1 lb/week', note: 'Preserve strength and manage fatigue.' },
  { key: 'strength', label: 'Strength Focus', target: 'performance first', note: 'Push compounds and track PRs.' },
  { key: 'hybrid', label: 'Hybrid Performance', target: 'conditioning + size', note: 'Balance lifting with running/cardio.' },
] as const;
