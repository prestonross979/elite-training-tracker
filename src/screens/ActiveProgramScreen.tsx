import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ActiveProgramState, TrainingPlan, WorkoutDay } from '../types/training';
import { getExerciseById, getExerciseAlternatives } from '../data/exercises';
import { getPlannedExerciseRecommendation } from '../logic/planProgression';
import type { ExerciseLog } from '../logic';
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
  dayLogs: Record<string, ExerciseLog>;
  onUpdateSet: (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => void;
  onUpdateExerciseField: (exerciseId: string, field: 'completed' | 'notes', value: boolean | string) => void;
  onCompleteDay: () => void;
  selectedCardioOptionId?: string;
  onSelectCardioOption: (optionId: string) => void;
  onPlanChange: (updatedPlan: TrainingPlan) => void;
  onResetPlan: () => void;
  onBrowsePlans: () => void;
};

export default function ActiveProgramScreen({
  activeProgram,
  selectedDayId,
  onSelectDayId,
  dayLogs,
  onUpdateSet,
  onUpdateExerciseField,
  onCompleteDay,
  selectedCardioOptionId,
  onSelectCardioOption,
  onPlanChange,
  onResetPlan,
  onBrowsePlans,
}: Props) {
  const [openExerciseId, setOpenExerciseId] = useState<string | null>(null);
  const [swappingExerciseId, setSwappingExerciseId] = useState<string | null>(null);

  const plan = activeProgram.activePlan;
  const recommendedDay = plan.workoutDays[activeProgram.currentDayIndex];
  const selectedDay: WorkoutDay = plan.workoutDays.find((day) => day.id === selectedDayId) ?? recommendedDay ?? plan.workoutDays[0];

  const completion = useMemo(() => {
    const total = selectedDay.exercises.length;
    const complete = selectedDay.exercises.filter((planned) => dayLogs[planned.exerciseId]?.completed).length;
    return { total, complete };
  }, [selectedDay, dayLogs]);

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
          {completion.total > 0 ? <Badge label={`${completion.complete}/${completion.total}`} /> : null}
        </View>

        {selectedDay.exercises.map((planned) => {
          const exercise = getExerciseById(planned.exerciseId);
          if (!exercise) return null;

          const log = dayLogs[planned.exerciseId];
          const isOpen = openExerciseId === planned.exerciseId;
          const isSwapping = swappingExerciseId === planned.exerciseId;

          return (
            <View key={planned.id} style={styles.exerciseCard}>
              <Pressable style={styles.exerciseHeaderRow} onPress={() => setOpenExerciseId(isOpen ? null : planned.exerciseId)}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.exerciseTitle}>
                    {log?.completed ? '✅ ' : ''}
                    {exercise.name}
                  </Text>
                  <Text style={styles.subtle}>
                    {planned.sets} sets • {planned.repRange}
                  </Text>
                </View>
              </Pressable>

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
                <View style={{ flex: 1 }}>
                  <Button label={isOpen ? 'Hide' : 'Log'} onPress={() => setOpenExerciseId(isOpen ? null : planned.exerciseId)} />
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

              {isOpen && log ? (
                <View style={styles.openArea}>
                  <View style={styles.progressionBox}>
                    <Text style={styles.stepperLabel}>Progression</Text>
                    <Text style={styles.bodyText}>{getPlannedExerciseRecommendation(exercise, planned, log)}</Text>
                  </View>

                  {log.sets.map((set, setIndex) => (
                    <View key={setIndex} style={styles.setRow}>
                      <Text style={styles.setLabel}>Set {setIndex + 1}</Text>
                      <TextInput
                        style={styles.setInput}
                        placeholder="Weight"
                        placeholderTextColor={colors.textSubtle}
                        keyboardType="decimal-pad"
                        value={set.weight}
                        onChangeText={(value) => onUpdateSet(planned.exerciseId, setIndex, 'weight', value)}
                      />
                      <TextInput
                        style={styles.setInput}
                        placeholder="Reps"
                        placeholderTextColor={colors.textSubtle}
                        keyboardType="number-pad"
                        value={set.reps}
                        onChangeText={(value) => onUpdateSet(planned.exerciseId, setIndex, 'reps', value)}
                      />
                    </View>
                  ))}

                  <Button
                    label={log.completed ? 'Completed' : 'Mark Complete'}
                    onPress={() => onUpdateExerciseField(planned.exerciseId, 'completed', !log.completed)}
                  />
                </View>
              ) : null}
            </View>
          );
        })}

        {selectedDay.cardioGroups.map((group) => (
          <CardioOptionPicker
            key={group.id}
            group={group}
            selectedOptionId={selectedCardioOptionId}
            onSelect={onSelectCardioOption}
          />
        ))}

        <View style={{ marginTop: 14 }}>
          <Button label="Complete Day" onPress={onCompleteDay} />
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
  openArea: { paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.borderMuted, gap: 10, marginTop: 12 },
  progressionBox: { backgroundColor: colors.surface, borderRadius: 14, padding: 10, borderWidth: 1, borderColor: colors.borderMuted },
  bodyText: { color: colors.text, fontSize: 13, lineHeight: 19, marginTop: 4 },
  setRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  setLabel: { color: colors.textMuted, width: 48, fontSize: 12 },
  setInput: { flex: 1, backgroundColor: colors.surface, color: colors.text, borderColor: colors.borderMuted, borderWidth: 1, borderRadius: 12, padding: 10 },
});
