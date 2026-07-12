import type { CardioActivity, CardioCategory, EquipmentType, TrainingGoal } from '../../types/training';
import { runningActivities } from './running';
import { walkingActivities } from './walking';
import { boxingActivities } from './boxing';
import { machineActivities } from './machines';
import { conditioningActivities } from './conditioning';

export const cardioActivities: CardioActivity[] = [
  ...runningActivities,
  ...walkingActivities,
  ...boxingActivities,
  ...machineActivities,
  ...conditioningActivities,
];

if (__DEV__) {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  cardioActivities.forEach((activity) => {
    if (seen.has(activity.id)) {
      duplicates.add(activity.id);
    }
    seen.add(activity.id);
  });

  if (duplicates.size > 0) {
    console.warn(`[cardio] Duplicate cardio activity IDs found: ${Array.from(duplicates).join(', ')}`);
  }
}

const cardioById = new Map(cardioActivities.map((activity) => [activity.id, activity]));

export function getCardioActivityById(id: string): CardioActivity | undefined {
  return cardioById.get(id);
}

export function getCardioByCategory(category: CardioCategory): CardioActivity[] {
  return cardioActivities.filter((activity) => activity.category === category);
}

export function getCardioByGoal(goal: TrainingGoal): CardioActivity[] {
  return cardioActivities.filter((activity) => activity.trainingGoals.includes(goal));
}

export function getCardioByEquipment(equipment: EquipmentType): CardioActivity[] {
  return cardioActivities.filter((activity) => activity.equipment.includes(equipment));
}
