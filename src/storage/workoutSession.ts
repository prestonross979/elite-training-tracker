import AsyncStorage from '@react-native-async-storage/async-storage';
import type { CardioIntensity, CardioMeasurement, WorkoutDay, WorkoutDayType } from '../types/training';
import type { SetLog } from '../logic';
import { getExerciseById } from '../data/exercises';
import { getCardioActivityById } from '../data/cardio';

const STORAGE_KEY = 'elite-gym-tracker-session-v1';
const STORAGE_VERSION = 1;

// Identity (exerciseId) is the source of truth; display metadata is resolved
// from the exercise database rather than duplicated here.
export type SessionExercise = {
  plannedExerciseId: string;
  exerciseId: string;
  repRange: string;
  isOptional: boolean;
  completed: boolean;
  notes: string;
  sets: SetLog[];
};

export type SessionCardioEntry = {
  plannedOptionId: string;
  cardioActivityId: string;
  intensity: CardioIntensity;
  measurement: CardioMeasurement;
  completed: boolean;
  notes: string;
  durationMinutes: string;
  distanceMiles: string;
  rounds: string;
  roundDurationSeconds: string;
  restSeconds: string;
  calories: string;
  steps: string;
};

export type WorkoutSession = {
  id: string;
  planId: string;
  workoutDayId: string;
  workoutName: string;
  dayType: WorkoutDayType;
  exercises: SessionExercise[];
  cardio: SessionCardioEntry[];
  startedAt: string;
  status: 'in-progress' | 'completed';
};

type SessionStorageShape = {
  version: number;
  session: WorkoutSession | null;
};

function emptyStorage(): SessionStorageShape {
  return { version: STORAGE_VERSION, session: null };
}

function isValidSession(value: unknown): value is WorkoutSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<WorkoutSession>;

  return (
    typeof session.id === 'string' &&
    typeof session.planId === 'string' &&
    typeof session.workoutDayId === 'string' &&
    typeof session.workoutName === 'string' &&
    typeof session.startedAt === 'string' &&
    (session.status === 'in-progress' || session.status === 'completed') &&
    Array.isArray(session.exercises) &&
    Array.isArray(session.cardio)
  );
}

function isValidStorageShape(value: unknown): value is SessionStorageShape {
  if (!value || typeof value !== 'object') return false;
  const shape = value as Partial<SessionStorageShape>;

  if (typeof shape.version !== 'number') return false;
  if (shape.session !== null && shape.session !== undefined && !isValidSession(shape.session)) return false;

  return true;
}

function migrate(raw: unknown): SessionStorageShape {
  if (!isValidStorageShape(raw)) {
    return emptyStorage();
  }

  return { version: STORAGE_VERSION, session: raw.session ?? null };
}

async function readStorage(): Promise<SessionStorageShape> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStorage();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyStorage();
  }
}

export async function loadSession(): Promise<WorkoutSession | null> {
  const storage = await readStorage();
  return storage.session;
}

export async function saveSession(session: WorkoutSession): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STORAGE_VERSION, session }));
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(emptyStorage()));
}

// True when the day has nothing plannable to log (a pure rest day).
export function isEmptyWorkoutDay(day: WorkoutDay): boolean {
  return day.exercises.length === 0 && day.cardioGroups.length === 0;
}

function buildSessionCardioEntry(day: WorkoutDay, selectedCardioOptionId: string): SessionCardioEntry | undefined {
  for (const group of day.cardioGroups) {
    const option = group.options.find((entry) => entry.id === selectedCardioOptionId);
    if (!option) continue;

    return {
      plannedOptionId: option.id,
      cardioActivityId: option.cardioActivityId,
      intensity: option.intensity,
      measurement: option.measurement,
      completed: false,
      notes: option.notes ?? '',
      durationMinutes: option.durationMinutes ? String(option.durationMinutes) : '',
      distanceMiles: option.distanceMiles ? String(option.distanceMiles) : '',
      rounds: option.rounds ? String(option.rounds) : '',
      roundDurationSeconds: option.roundDurationSeconds ? String(option.roundDurationSeconds) : '',
      restSeconds: option.restSeconds ? String(option.restSeconds) : '',
      calories: '',
      steps: '',
    };
  }

  return undefined;
}

let sessionIdCounter = 0;

function nextSessionId(): string {
  sessionIdCounter += 1;
  return `session-${Date.now()}-${sessionIdCounter}`;
}

export function createProgramWorkoutSession(
  planId: string,
  day: WorkoutDay,
  selectedCardioOptionId: string | undefined,
): WorkoutSession {
  const exercises: SessionExercise[] = day.exercises
    .filter((planned) => getExerciseById(planned.exerciseId))
    .map((planned) => ({
      plannedExerciseId: planned.id,
      exerciseId: planned.exerciseId,
      repRange: planned.repRange,
      isOptional: Boolean(planned.isOptional),
      completed: false,
      notes: '',
      sets: Array.from({ length: planned.sets }).map(() => ({ weight: '', reps: '' })),
    }));

  const cardio: SessionCardioEntry[] = [];
  if (selectedCardioOptionId) {
    const entry = buildSessionCardioEntry(day, selectedCardioOptionId);
    if (entry) cardio.push(entry);
  }

  return {
    id: nextSessionId(),
    planId,
    workoutDayId: day.id,
    workoutName: day.name,
    dayType: day.type,
    exercises,
    cardio,
    startedAt: new Date().toISOString(),
    status: 'in-progress',
  };
}

export function resolveSessionExerciseName(exerciseId: string): string {
  return getExerciseById(exerciseId)?.name ?? exerciseId;
}

export function resolveSessionCardioName(cardioActivityId: string): string {
  return getCardioActivityById(cardioActivityId)?.name ?? cardioActivityId;
}
