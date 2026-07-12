import type { TrainingPlan } from '../../types/training';
import { getExerciseById } from '../exercises';
import { getCardioActivityById } from '../cardio';
import { eliteHybridPlan } from './eliteHybrid';
import { pushPullLegsPlan } from './pushPullLegs';
import { upperLowerPlan } from './upperLower';
import { fourDayHypertrophyPlan } from './fourDayHypertrophy';
import { broSplitPlan } from './broSplit';

export const builtInTrainingPlans: TrainingPlan[] = [
  eliteHybridPlan,
  pushPullLegsPlan,
  upperLowerPlan,
  fourDayHypertrophyPlan,
  broSplitPlan,
];

if (__DEV__) {
  builtInTrainingPlans.forEach((plan) => {
    plan.workoutDays.forEach((day) => {
      day.exercises.forEach((planned) => {
        if (!getExerciseById(planned.exerciseId)) {
          console.warn(`[plans] "${plan.id}" -> "${day.id}" references unknown exercise "${planned.exerciseId}"`);
        }
      });

      day.cardioGroups.forEach((group) => {
        group.options.forEach((option) => {
          if (!getCardioActivityById(option.cardioActivityId)) {
            console.warn(`[plans] "${plan.id}" -> "${day.id}" references unknown cardio activity "${option.cardioActivityId}"`);
          }
        });
      });
    });
  });
}

const planById = new Map(builtInTrainingPlans.map((plan) => [plan.id, plan]));

export function getTrainingPlanById(id: string): TrainingPlan | undefined {
  return planById.get(id);
}

export function getFeaturedTrainingPlan(): TrainingPlan | undefined {
  return builtInTrainingPlans.find((plan) => plan.isFeatured);
}

// JSON round-trip is a safe deep clone here since plan templates are plain serializable data.
export function cloneTrainingPlan(plan: TrainingPlan, overrides?: Partial<Pick<TrainingPlan, 'id' | 'source' | 'createdAt' | 'updatedAt'>>): TrainingPlan {
  const cloned: TrainingPlan = JSON.parse(JSON.stringify(plan));

  return {
    ...cloned,
    id: overrides?.id ?? cloned.id,
    source: overrides?.source ?? 'custom',
    createdAt: overrides?.createdAt ?? cloned.createdAt,
    updatedAt: overrides?.updatedAt ?? cloned.updatedAt,
  };
}
