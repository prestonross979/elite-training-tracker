import type {
  CardioIntensity,
  CardioMeasurement,
  CardioSelectionGroup,
  DifficultyLevel,
  MuscleGroup,
  PlannedCardioOption,
  PlannedExercise,
  TrainingGoal,
  TrainingPlan,
  WorkoutDay,
  WorkoutDayType,
} from '../../types/training';

const TEMPLATE_TIMESTAMP = '2026-01-01T00:00:00.000Z';

type PlannedExerciseInput = {
  exerciseId: string;
  sets: number;
  repRange: string;
  restSeconds?: number;
  targetRpe?: number;
  notes?: string;
  isOptional?: boolean;
};

type CardioOptionInput = {
  cardioActivityId: string;
  intensity: CardioIntensity;
  measurement: CardioMeasurement;
  label?: string;
  durationMinutes?: number;
  distanceMiles?: number;
  rounds?: number;
  roundDurationSeconds?: number;
  restSeconds?: number;
  notes?: string;
};

type CardioGroupInput = {
  id: string;
  title: string;
  description?: string;
  minimumSelections?: number;
  maximumSelections?: number;
  options: CardioOptionInput[];
};

type WorkoutDayInput = {
  id: string;
  name: string;
  shortName?: string;
  description?: string;
  type: WorkoutDayType;
  targetMuscles: MuscleGroup[];
  trainingGoals: TrainingGoal[];
  exercises?: PlannedExerciseInput[];
  cardioGroups?: CardioGroupInput[];
  estimatedDurationMinutes?: number;
  order: number;
  isOptional?: boolean;
};

export function buildWorkoutDay(input: WorkoutDayInput): WorkoutDay {
  const exercises: PlannedExercise[] = (input.exercises ?? []).map((exercise, index) => ({
    id: `${input.id}-${exercise.exerciseId}`,
    exerciseId: exercise.exerciseId,
    sets: exercise.sets,
    repRange: exercise.repRange,
    restSeconds: exercise.restSeconds,
    targetRpe: exercise.targetRpe,
    notes: exercise.notes,
    order: index + 1,
    isOptional: exercise.isOptional,
  }));

  const cardioGroups: CardioSelectionGroup[] = (input.cardioGroups ?? []).map((group) => buildCardioGroup(group));

  return {
    id: input.id,
    name: input.name,
    shortName: input.shortName,
    description: input.description,
    type: input.type,
    targetMuscles: input.targetMuscles,
    trainingGoals: input.trainingGoals,
    exercises,
    cardioGroups,
    estimatedDurationMinutes: input.estimatedDurationMinutes,
    order: input.order,
    isOptional: input.isOptional,
  };
}

export function buildCardioGroup(input: CardioGroupInput): CardioSelectionGroup {
  const options: PlannedCardioOption[] = input.options.map((option, index) => ({
    id: `${input.id}-${option.cardioActivityId}`,
    cardioActivityId: option.cardioActivityId,
    label: option.label,
    intensity: option.intensity,
    measurement: option.measurement,
    durationMinutes: option.durationMinutes,
    distanceMiles: option.distanceMiles,
    rounds: option.rounds,
    roundDurationSeconds: option.roundDurationSeconds,
    restSeconds: option.restSeconds,
    notes: option.notes,
    order: index + 1,
  }));

  return {
    id: input.id,
    title: input.title,
    description: input.description,
    minimumSelections: input.minimumSelections ?? 1,
    maximumSelections: input.maximumSelections ?? 1,
    options,
  };
}

type TrainingPlanInput = {
  id: string;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  trainingGoals: TrainingGoal[];
  daysPerCycle: number;
  recommendedTrainingDaysPerWeek?: number;
  workoutDays: WorkoutDay[];
  isFeatured?: boolean;
};

export function buildTrainingPlan(input: TrainingPlanInput): TrainingPlan {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    source: 'built-in',
    difficulty: input.difficulty,
    trainingGoals: input.trainingGoals,
    daysPerCycle: input.daysPerCycle,
    recommendedTrainingDaysPerWeek: input.recommendedTrainingDaysPerWeek,
    workoutDays: input.workoutDays,
    createdAt: TEMPLATE_TIMESTAMP,
    updatedAt: TEMPLATE_TIMESTAMP,
    isEditable: true,
    isFeatured: input.isFeatured,
  };
}
