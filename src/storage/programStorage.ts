import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ActiveProgramState, TrainingPlan, WorkoutDay } from '../types/training';
import { cloneTrainingPlan, getTrainingPlanById } from '../data/plans';

const STORAGE_KEY = 'elite-gym-tracker-programs-v1';
const STORAGE_VERSION = 1;

type ProgramStorageShape = {
  version: number;
  active: ActiveProgramState | null;
  selectedCardioOptionByDay: Record<string, string>;
};

function emptyStorage(): ProgramStorageShape {
  return { version: STORAGE_VERSION, active: null, selectedCardioOptionByDay: {} };
}

function isValidActiveProgramState(value: unknown): value is ActiveProgramState {
  if (!value || typeof value !== 'object') return false;
  const state = value as Partial<ActiveProgramState>;
  return (
    typeof state.selectedPlanId === 'string' &&
    typeof state.currentDayIndex === 'number' &&
    typeof state.selectedAt === 'string' &&
    typeof state.updatedAt === 'string' &&
    !!state.activePlan &&
    typeof state.activePlan === 'object' &&
    Array.isArray(state.activePlan.workoutDays)
  );
}

function isValidStorageShape(value: unknown): value is ProgramStorageShape {
  if (!value || typeof value !== 'object') return false;
  const shape = value as Partial<ProgramStorageShape>;

  if (typeof shape.version !== 'number') return false;
  if (shape.active !== null && !isValidActiveProgramState(shape.active)) return false;
  if (shape.selectedCardioOptionByDay && typeof shape.selectedCardioOptionByDay !== 'object') return false;

  return true;
}

function migrate(raw: unknown): ProgramStorageShape {
  if (!isValidStorageShape(raw)) {
    return emptyStorage();
  }

  return {
    version: STORAGE_VERSION,
    active: raw.active,
    selectedCardioOptionByDay: raw.selectedCardioOptionByDay ?? {},
  };
}

async function readStorage(): Promise<ProgramStorageShape> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStorage();
    return migrate(JSON.parse(raw));
  } catch {
    return emptyStorage();
  }
}

async function writeStorage(shape: ProgramStorageShape): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(shape));
}

export async function loadActiveProgram(): Promise<ActiveProgramState | null> {
  const storage = await readStorage();
  return storage.active;
}

export async function saveActiveProgram(active: ActiveProgramState): Promise<void> {
  const storage = await readStorage();
  storage.active = active;
  await writeStorage(storage);
}

export async function clearActiveProgram(): Promise<void> {
  const storage = await readStorage();
  storage.active = null;
  storage.selectedCardioOptionByDay = {};
  await writeStorage(storage);
}

export async function selectBuiltInPlan(planId: string): Promise<ActiveProgramState | null> {
  const template = getTrainingPlanById(planId);
  if (!template) return null;

  const now = new Date().toISOString();
  const activePlan: TrainingPlan = cloneTrainingPlan(template, {
    id: template.id,
    source: 'custom',
    createdAt: now,
    updatedAt: now,
  });

  const active: ActiveProgramState = {
    selectedPlanId: template.id,
    activePlan,
    currentDayIndex: 0,
    selectedAt: now,
    updatedAt: now,
  };

  await saveActiveProgram(active);
  return active;
}

export async function resetPlanToTemplate(): Promise<ActiveProgramState | null> {
  const storage = await readStorage();
  if (!storage.active) return null;

  const template = getTrainingPlanById(storage.active.selectedPlanId);
  if (!template) return null;

  const now = new Date().toISOString();
  const active: ActiveProgramState = {
    ...storage.active,
    activePlan: cloneTrainingPlan(template, { id: template.id, source: 'custom', createdAt: now, updatedAt: now }),
    currentDayIndex: 0,
    updatedAt: now,
  };

  await saveActiveProgram(active);
  return active;
}

export async function saveModifiedPlan(activePlan: TrainingPlan): Promise<ActiveProgramState | null> {
  const storage = await readStorage();
  if (!storage.active) return null;

  const now = new Date().toISOString();
  const active: ActiveProgramState = {
    ...storage.active,
    activePlan: { ...activePlan, updatedAt: now },
    updatedAt: now,
  };

  await saveActiveProgram(active);
  return active;
}

export async function setCurrentDayIndex(index: number): Promise<ActiveProgramState | null> {
  const storage = await readStorage();
  if (!storage.active) return null;

  const active: ActiveProgramState = {
    ...storage.active,
    currentDayIndex: index,
    updatedAt: new Date().toISOString(),
  };

  await saveActiveProgram(active);
  return active;
}

// Walks forward from a just-completed day to the next non-rest day, so the
// recommendation never lands on a rest day even though the user can still
// manually open one. Falls back to the immediate next day if every other
// day in the cycle is rest.
function findNextTrainableIndex(days: WorkoutDay[], fromIndex: number): number {
  for (let offset = 1; offset <= days.length; offset += 1) {
    const index = (fromIndex + offset) % days.length;
    if (days[index].type !== 'rest') return index;
  }
  return (fromIndex + 1) % days.length;
}

export async function recordWorkoutDayCompletion(workoutDayId: string, completedAt: string): Promise<ActiveProgramState | null> {
  const storage = await readStorage();
  if (!storage.active) return null;

  const days = storage.active.activePlan.workoutDays;
  const completedIndex = days.findIndex((day) => day.id === workoutDayId);
  const nextIndex = completedIndex >= 0 ? findNextTrainableIndex(days, completedIndex) : storage.active.currentDayIndex;

  const active: ActiveProgramState = {
    ...storage.active,
    currentDayIndex: nextIndex,
    lastCompletedWorkoutDayId: workoutDayId,
    lastCompletedAt: completedAt,
    updatedAt: completedAt,
  };

  await saveActiveProgram(active);
  return active;
}

export async function setSelectedCardioOption(workoutDayId: string, cardioOptionId: string): Promise<void> {
  const storage = await readStorage();
  storage.selectedCardioOptionByDay[workoutDayId] = cardioOptionId;
  await writeStorage(storage);
}

export async function getSelectedCardioOption(workoutDayId: string): Promise<string | undefined> {
  const storage = await readStorage();
  return storage.selectedCardioOptionByDay[workoutDayId];
}
