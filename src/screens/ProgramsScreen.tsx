import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ActiveProgramState } from '../types/training';
import { builtInTrainingPlans, getFeaturedTrainingPlan } from '../data/plans';
import { colors } from '../theme/colors';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import PlanCard from '../components/programs/PlanCard';

type Props = {
  activeProgram: ActiveProgramState | null;
  onSelectPlan: (planId: string) => void;
  onOpenActiveProgram: () => void;
};

export default function ProgramsScreen({ activeProgram, onSelectPlan, onOpenActiveProgram }: Props) {
  const featured = getFeaturedTrainingPlan();
  const otherPlans = builtInTrainingPlans.filter((plan) => plan.id !== featured?.id);

  return (
    <View style={styles.section}>
      {activeProgram ? (
        <Card>
          <Text style={styles.title}>Active Program</Text>
          <Text style={styles.subtle}>{activeProgram.activePlan.name}</Text>
          <View style={{ marginTop: 12 }}>
            <Button label="Open Active Program" onPress={onOpenActiveProgram} />
          </View>
        </Card>
      ) : (
        <Card>
          <Text style={styles.title}>No Active Program</Text>
          <Text style={styles.subtle}>Select a plan below to get started. Selecting a plan creates your own editable copy.</Text>
        </Card>
      )}

      {featured ? (
        <>
          <Text style={styles.sectionLabel}>Featured</Text>
          <PlanCard plan={featured} isActive={activeProgram?.selectedPlanId === featured.id} onPress={() => onSelectPlan(featured.id)} />
        </>
      ) : null}

      <Text style={styles.sectionLabel}>All Plans</Text>
      {otherPlans.map((plan) => (
        <PlanCard key={plan.id} plan={plan} isActive={activeProgram?.selectedPlanId === plan.id} onPress={() => onSelectPlan(plan.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 4 },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  subtle: { color: colors.textMuted, fontSize: 13, marginTop: 4 },
  sectionLabel: { color: colors.textSubtle, fontSize: 12, fontWeight: '700', marginTop: 18, marginBottom: 2, textTransform: 'uppercase' },
});
