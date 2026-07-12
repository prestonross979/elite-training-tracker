import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ActiveProgramState, TrainingPlan, WorkoutDay } from '../types/training';
import { getExerciseById, getExerciseAlternatives } from '../data/exercises';
import { colors } from '../theme/colors';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import WorkoutDayCard from '../components/programs/WorkoutDayCard';
import CardioOptionPicker from '../components/cardio/CardioOptionPicker';

type Props = {
  activeProgram: ActiveProgramState;
  selectedDayId: string;
  onSelectDayId: (id: string) => void;
  selectedCardioOptionId?: string;
  onSelectCardioOption: (optionId: string) => void;
  onPlanChange: (updatedPlan: TrainingPlan) => void;
  onResetPlan: () => void;
  onBrowsePlans: () => void;
  activeSessionDayId: string | null;
  onStartWorkout: () => void;
  onResumeWorkout: () => void;
};

export default function ActiveProgramScreen({
  activeProgram,
  selectedDayId,
  onSelectDayId,
  selectedCardioOptionId,
  onSelectCardioOption,
  onPlanChange,
  onResetPlan,
  onBrowsePlans,
  activeSessionDayId,
  onStartWorkout,
  onResumeWorkout,
}: Props) {
  const [swappingExerciseId, setSwappingExerciseId] = useState<string | null>(null);

  const plan = activeProgram.activePlan;
  const recommendedDay = plan.workoutDays[activeProgram.currentDayIndex];
  const selectedDay: WorkoutDay = plan.workoutDays.find((day) => day.id === selectedDayId) ?? recommendedDay ?? plan.workoutDays[0];
  const hasNothingPlanned = selectedDay.exercises.length === 0 && selectedDay.cardioGroups.length === 0;
  const isSessionHere = activeSessionDayId === selectedDay.id;

  function updateDay(mutator: (day: WorkoutDay) => WorkoutDay) {
    const updatedDays = plan.workoutDays.map((day) => (day.id === selectedDay.id ? mutator(day) : day));
    onPlanChange({ ...plan, workoutDays: updatedDays });
  }

  function replaceExercise(plannedExerciseId: string, newExerciseId: string) {
    updateDay((day) => ({
      ...day,
      exercises: day.exercises.map((planned) =>
        planned.id === plannedExerciseId ? { ...planned, exerciseId: newExerciseId } : planned,
      ),
    }));
    setSwappingExerciseId(null);
  }

  function removeExercise(plannedExerciseId: string) {
    updateDay((day) => ({
      ...day,
      exercises: day.exercises.filter((planned) => planned.id !== plannedExerciseId),
    }));
  }

  function changeSets(plannedExerciseId: string, delta: number) {
    updateDay((day) => ({
      ...day,
      exercises: day.exercises.map((planned) =>
        planned.id === plannedExerciseId ? { ...planned, sets: Math.max(1, planned.sets + delta) } : planned,
      ),
    }));
  }

  function changeRepRange(plannedExerciseId: string, value: string) {
    updateDay((day) => ({
      ...day,
      exercises: day.exercises.map((planned) => (planned.id === plannedExerciseId ? { ...planned, repRange: value } : planned)),
    }));
  }

  return (
    <View style={styles.section}>
      <Card>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.subtle}>Active program</Text>
          </View>
          <Badge label={`Day ${activeProgram.currentDayIndex + 1}/${plan.daysPerCycle}`} />
        </View>

        <View style={styles.actionsRow}>
          <View style={{ flex: 1 }}>
            <Button label="Reset to Template" variant="secondary" onPress={onResetPlan} />
          </View>
          <View style={{ flex: 1 }}>
            <Button label="Browse Plans" variant="secondary" onPress={onBrowsePlans} />
          </View>
        </View>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
        {plan.workoutDays.map((day) => (
          <WorkoutDayCard
            key={day.id}
            day={day}
            isSelected={day.id === selectedDay.id}
            isRecommended={day.id === recommendedDay?.id}
            hasSessionInProgress={activeSessionDayId === day.id}
            onPress={() => onSelectDayId(day.id)}
          />
        ))}
      </ScrollView>

      <Card>
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dayTitle}>{selectedDay.name}</Text>
            {selectedDay.description ? <Text style={styles.subtle}>{selectedDay.description}</Text> : null}
          </View>
          {activeSessionDayId && activeSessionDayId !== selectedDay.id ? <Badge label="Other Session Active" /> : null}
        </View>

        {hasNothingPlanned ? (
          <Text style={styles.subtle}>Rest day — nothing planned. You can still mark it complete from the Workout tab.</Text>
        ) : (
          selectedDay.exercises.map((planned) => {
            const exercise = getExerciseById(planned.exerciseId);
            if (!exercise) return null;

            const isSwapping = swappingExerciseId === planned.exerciseId;

            return (
              <View key={planned.id} style={styles.exerciseCard}>
                <View style={styles.exerciseHeaderRow}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                      <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                      {planned.isOptional ? <Badge label="Optional" /> : null}
                    </View>
                    <Text style={styles.subtle}>
                      {planned.sets} sets • {planned.repRange}
                    </Text>
                  </View>
                </View>

                <View style={styles.stepperRow}>
                  <Text style={styles.stepperLabel}>Sets</Text>
                  <Button label="-" variant="secondary" onPress={() => changeSets(planned.id, -1)} />
                  <Text style={styles.stepperValue}>{planned.sets}</Text>
                  <Button label="+" variant="secondary" onPress={() => changeSets(planned.id, 1)} />
                  <View style={{ flex: 1 }}>
                    <TextInput
                      style={styles.repRangeInput}
                      value={planned.repRange}
                      onChangeText={(value) => changeRepRange(planned.id, value)}
                      placeholder="Rep range"
                      placeholderTextColor={colors.textSubtle}
                    />
                  </View>
                </View>

                <View style={styles.actionsRow}>
                  <View style={{ flex: 1 }}>
                    <Button
                      label={isSwapping ? 'Cancel Swap' : 'Swap'}
                      variant="secondary"
                      onPress={() => setSwappingExerciseId(isSwapping ? null : planned.exerciseId)}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button label="Remove" variant="secondary" onPress={() => removeExercise(planned.id)} />
                  </View>
                </View>

                {isSwapping ? (
                  <View style={styles.altRow}>
                    {getExerciseAlternatives(planned.exerciseId).length === 0 ? (
                      <Text style={styles.subtle}>No alternatives listed for this exercise.</Text>
                    ) : (
                      getExerciseAlternatives(planned.exerciseId).map((alt) => (
                        <Pressable key={alt.id} style={{ marginTop: 6 }} onPress={() => replaceExercise(planned.id, alt.id)}>
                          <Badge label={alt.name} tone="accent" />
                        </Pressable>
                      ))
                    )}
                  </View>
                ) : null}
              </View>
            );
          })
        )}

        {selectedDay.cardioGroups.map((group) => (
          <CardioOptionPicker
            key={group.id}
            group={group}
            selectedOptionId={selectedCardioOptionId}
            onSelect={onSelectCardioOption}
          />
        ))}

        <View style={{ marginTop: 14 }}>
          {isSessionHere ? (
            <Button label="Resume Workout" onPress={onResumeWorkout} />
          ) : (
            <Button label="Start Workout" onPress={onStartWorkout} disabled={hasNothingPlanned} />
          )}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  planName: { color: colors.text, fontSize: 20, fontWeight: '800' },
  dayTitle: { color: colors.text, fontSize: 18, fontWeight: '800' },
  subtle: { color: colors.textMuted, fontSize: 12, marginTop: 4 },
  actionsRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  dayScroll: { paddingVertical: 4 },
  exerciseCard: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderMuted,
    marginTop: 12,
    padding: 12,
  },
  exerciseHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  exerciseTitle: { color: colors.text, fontSize: 15, fontWeight: '800' },
  stepperRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  stepperLabel: { color: colors.textMuted, fontSize: 12, fontWeight: '600' },
  stepperValue: { color: colors.text, fontWeight: '700', width: 20, textAlign: 'center' },
  repRangeInput: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderColor: colors.borderMuted,
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
  },
  altRow: { marginTop: 10, gap: 6 },
});
