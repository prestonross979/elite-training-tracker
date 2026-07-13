// src/types/training.ts

export type MuscleGroup =
  | "chest"
  | "upper-chest"
  | "lower-chest"
  | "back"
  | "lats"
  | "upper-back"
  | "lower-back"
  | "traps"
  | "shoulders"
  | "front-delts"
  | "side-delts"
  | "rear-delts"
  | "biceps"
  | "triceps"
  | "forearms"
  | "quadriceps"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "adductors"
  | "abductors"
  | "core"
  | "full-body";

export type EquipmentType =
  | "barbell"
  | "dumbbell"
  | "cable"
  | "machine"
  | "smith-machine"
  | "bodyweight"
  | "bench"
  | "pull-up-bar"
  | "resistance-band"
  | "kettlebell"
  | "medicine-ball"
  | "sled"
  | "heavy-bag"
  | "jump-rope"
  | "treadmill"
  | "stairmaster"
  | "rower"
  | "bike"
  | "elliptical"
  | "outdoors"
  | "none";

export type MovementPattern =
  | "horizontal-push"
  | "vertical-push"
  | "horizontal-pull"
  | "vertical-pull"
  | "squat"
  | "hinge"
  | "lunge"
  | "carry"
  | "rotation"
  | "anti-rotation"
  | "core-flexion"
  | "core-extension"
  | "isolation"
  | "locomotion"
  | "conditioning";

export type ExerciseCategory =
  | "compound"
  | "isolation"
  | "bodyweight"
  | "mobility"
  | "core"
  | "conditioning";

export type DifficultyLevel =
  | "beginner"
  | "intermediate"
  | "advanced";

export type ProgressionType =
  | "weight"
  | "repetitions"
  | "duration"
  | "distance"
  | "rounds"
  | "pace"
  | "resistance"
  | "assistance";

export type TrainingGoal =
  | "strength"
  | "hypertrophy"
  | "endurance"
  | "conditioning"
  | "athleticism"
  | "general-fitness"
  | "fat-loss"
  | "recovery";

export type CardioCategory =
  | "running"
  | "walking"
  | "boxing"
  | "cycling"
  | "rowing"
  | "stair-climbing"
  | "jump-rope"
  | "sled"
  | "carries"
  | "elliptical"
  | "other";

export type CardioIntensity =
  | "recovery"
  | "easy"
  | "zone-2"
  | "moderate"
  | "tempo"
  | "hard"
  | "hiit"
  | "max-effort";

export type CardioMeasurement =
  | "duration"
  | "distance"
  | "rounds"
  | "calories"
  | "steps";

export type WorkoutDayType =
  | "strength"
  | "hypertrophy"
  | "cardio"
  | "hybrid"
  | "recovery"
  | "rest";

export type PlanSource = "built-in" | "custom" | "ai-generated";

export interface Exercise {
  id: string;
  name: string;
  description?: string;

  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];

  equipment: EquipmentType[];
  movementPattern: MovementPattern;
  category: ExerciseCategory;
  difficulty: DifficultyLevel;

  progressionType: ProgressionType;
  defaultSets: number;
  defaultRepRange?: string;
  defaultRestSeconds?: number;
  defaultWeightIncrement?: number;

  alternativeExerciseIds: string[];
  instructions?: string[];
  coachingCues?: string[];

  isUnilateral?: boolean;
  isBodyweight?: boolean;
}

export interface CardioActivity {
  id: string;
  name: string;
  description?: string;

  category: CardioCategory;
  equipment: EquipmentType[];
  supportedMeasurements: CardioMeasurement[];
  supportedIntensities: CardioIntensity[];

  defaultMeasurement: CardioMeasurement;
  defaultDurationMinutes?: number;
  defaultDistanceMiles?: number;
  defaultRounds?: number;
  defaultRoundDurationSeconds?: number;
  defaultRestSeconds?: number;

  trainingGoals: TrainingGoal[];
  difficulty: DifficultyLevel;

  instructions?: string[];
}

export interface PlannedExercise {
  id: string;
  exerciseId: string;

  sets: number;
  repRange: string;
  restSeconds?: number;

  targetRpe?: number;
  notes?: string;

  order: number;
  isOptional?: boolean;
}

export interface PlannedCardioOption {
  id: string;
  cardioActivityId: string;

  label?: string;
  intensity: CardioIntensity;
  measurement: CardioMeasurement;

  durationMinutes?: number;
  distanceMiles?: number;
  rounds?: number;
  roundDurationSeconds?: number;
  restSeconds?: number;

  notes?: string;
  order: number;
}

export interface CardioSelectionGroup {
  id: string;
  title: string;
  description?: string;

  minimumSelections: number;
  maximumSelections: number;

  options: PlannedCardioOption[];
}

export interface WorkoutDay {
  id: string;
  name: string;
  shortName?: string;
  description?: string;

  type: WorkoutDayType;
  targetMuscles: MuscleGroup[];
  trainingGoals: TrainingGoal[];

  exercises: PlannedExercise[];
  cardioGroups: CardioSelectionGroup[];

  estimatedDurationMinutes?: number;
  order: number;

  isOptional?: boolean;
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;

  source: PlanSource;
  difficulty: DifficultyLevel;
  trainingGoals: TrainingGoal[];

  daysPerCycle: number;
  recommendedTrainingDaysPerWeek?: number;

  workoutDays: WorkoutDay[];

  createdAt: string;
  updatedAt: string;

  isEditable: boolean;
  isFeatured?: boolean;
}

export interface ActiveProgramState {
  selectedPlanId: string;
  activePlan: TrainingPlan;

  currentDayIndex: number;
  lastCompletedWorkoutDayId?: string;
  lastCompletedAt?: string;

  selectedAt: string;
  updatedAt: string;
}

export interface CompletedSet {
  setNumber: number;
  weight: number;
  reps: number;

  completed: boolean;
  rpe?: number;
  notes?: string;
}

export interface CompletedExercise {
  plannedExerciseId?: string;
  exerciseId: string;
  exerciseName: string;

  sets: CompletedSet[];
  notes?: string;
}

export interface CompletedCardio {
  cardioActivityId: string;
  cardioActivityName: string;

  intensity: CardioIntensity;
  measurement: CardioMeasurement;

  durationMinutes?: number;
  distanceMiles?: number;
  rounds?: number;
  calories?: number;
  steps?: number;

  notes?: string;
}

export interface CompletedWorkout {
  id: string;
  planId?: string;
  workoutDayId?: string;

  workoutName: string;
  startedAt: string;
  completedAt: string;

  exercises: CompletedExercise[];
  cardio: CompletedCardio[];

  notes?: string;
}
