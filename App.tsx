import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PROGRAM, PHASES } from './src/program';
import { ExerciseLog, getRecommendation, todayName } from './src/logic';
import { StatusBar } from 'expo-status-bar';
import type { ActiveProgramState, TrainingPlan, WorkoutDay } from './src/types/training';
import {
  loadActiveProgram,
  selectBuiltInPlan,
  resetPlanToTemplate,
  saveModifiedPlan,
  recordWorkoutDayCompletion,
  setSelectedCardioOption,
  getSelectedCardioOption,
} from './src/storage/programStorage';
import ProgramsScreen from './src/screens/ProgramsScreen';
import ActiveProgramScreen from './src/screens/ActiveProgramScreen';
import SessionWorkoutScreen from './src/screens/SessionWorkoutScreen';
import { getExerciseById } from './src/data/exercises';
import BottomTabs, { RootTab } from './src/components/BottomTabs';
import ExerciseLogCard from './src/components/workouts/ExerciseLogCard';
import WorkoutSummaryCard from './src/components/workouts/WorkoutSummaryCard';
import {
  loadSession,
  saveSession,
  clearSession,
  createProgramWorkoutSession,
  isEmptyWorkoutDay,
} from './src/storage/workoutSession';
import type { WorkoutSession, SessionCardioEntry } from './src/storage/workoutSession';
import { buildSessionSummary, summarizeCardioForHistoryNotes } from './src/logic/sessionSummary';
import type { SessionSummary } from './src/logic/sessionSummary';

type AppState = {
  phase: typeof PHASES[number]['key'];
  athleteName: string;
  bodyweight: string;
  selectedDay: string;
  logs: Record<string, ExerciseLog[]>;
  weighIns: { date: string; weight: string }[];
  coachNotes: string;
  history: {
    date: string;
    day: string;
    title: string;
    logs: ExerciseLog[];
    notes: string;
  }[];
  // Keyed by workoutDayId -> exerciseId so logged history survives plan edits and resets.
  programLogs: Record<string, Record<string, ExerciseLog>>;
};

const STORAGE_KEY = 'elite-gym-tracker-expo-v2';

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function createDefaultState(): AppState {
  const logs: Record<string, ExerciseLog[]> = {};

  PROGRAM.forEach((day) => {
    logs[day.day] = day.exercises.map((exercise) => ({
      name: exercise.name,
      completed: false,
      notes: '',
      sets: Array.from({ length: exercise.sets }).map(() => ({
        weight: '',
        reps: '',
      })),
    }));
  });

  return {
    phase: 'lean_bulk',
    athleteName: '',
    bodyweight: '',
    selectedDay: todayName(),
    logs,
    weighIns: [{ date: new Date().toISOString().slice(0, 10), weight: '' }],
    coachNotes: '',
    history: [],
    programLogs: {},
  };
}

function normalizeState(saved: Partial<AppState> | null): AppState {
  const base = createDefaultState();

  if (!saved) return base;

  const merged: AppState = {
    ...base,
    ...saved,
    logs: saved.logs ?? base.logs,
    weighIns: saved.weighIns ?? base.weighIns,
    coachNotes: saved.coachNotes ?? '',
    history: saved.history ?? [],
    selectedDay: saved.selectedDay ?? base.selectedDay,
    phase: saved.phase ?? base.phase,
    programLogs: saved.programLogs ?? {},
  };

  PROGRAM.forEach((day) => {
    if (!merged.logs[day.day]) {
      merged.logs[day.day] = base.logs[day.day];
    }

    day.exercises.forEach((exercise, index) => {
      if (!merged.logs[day.day][index]) {
        merged.logs[day.day][index] = base.logs[day.day][index];
      }

      if (!merged.logs[day.day][index].sets) {
        merged.logs[day.day][index].sets = base.logs[day.day][index].sets;
      }
    });
  });

  return merged;
}

export default function App() {
  const [state, setState] = useState<AppState>(createDefaultState());
  const [tab, setTab] = useState<RootTab>('workout');

  const [activeProgram, setActiveProgram] = useState<ActiveProgramState | null>(null);
  const [programsView, setProgramsView] = useState<'browse' | 'active'>('browse');
  const [selectedProgramDayId, setSelectedProgramDayId] = useState<string | null>(null);
  const [selectedCardioOptionId, setSelectedCardioOptionId] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          setState(normalizeState(JSON.parse(raw)));
        }
      })
      .catch(() => {});

    loadActiveProgram()
      .then((loaded) => {
        if (!loaded) return;
        setActiveProgram(loaded);
        const recommendedDayId = loaded.activePlan.workoutDays[loaded.currentDayIndex]?.id;
        if (recommendedDayId) {
          setSelectedProgramDayId(recommendedDayId);
        }
      })
      .catch(() => {});

    loadSession()
      .then((loaded) => {
        if (loaded && loaded.status === 'in-progress') {
          setSession(loaded);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  useEffect(() => {
    if (session && session.status === 'in-progress') {
      saveSession(session).catch(() => {});
    }
  }, [session]);

  useEffect(() => {
    if (!selectedProgramDayId) return;
    getSelectedCardioOption(selectedProgramDayId)
      .then(setSelectedCardioOptionId)
      .catch(() => {});
  }, [selectedProgramDayId]);

  const selectedProgramDay: WorkoutDay | undefined = useMemo(() => {
    if (!activeProgram || !selectedProgramDayId) return undefined;
    return activeProgram.activePlan.workoutDays.find((day) => day.id === selectedProgramDayId);
  }, [activeProgram, selectedProgramDayId]);

  const handleSelectPlan = (planId: string) => {
    selectBuiltInPlan(planId).then((result) => {
      if (!result) return;
      setActiveProgram(result);
      setSelectedProgramDayId(result.activePlan.workoutDays[result.currentDayIndex]?.id ?? null);
      setProgramsView('active');
    });
  };

  const handleResetProgramPlan = () => {
    resetPlanToTemplate().then((result) => {
      if (!result) return;
      setActiveProgram(result);
      setSelectedProgramDayId(result.activePlan.workoutDays[result.currentDayIndex]?.id ?? null);
    });
  };

  const handleProgramPlanChange = (updatedPlan: TrainingPlan) => {
    saveModifiedPlan(updatedPlan).then((result) => {
      if (result) setActiveProgram(result);
    });
  };

  const handleSelectCardioOption = (optionId: string) => {
    if (!selectedProgramDayId) return;
    setSelectedCardioOptionId(optionId);
    setSelectedCardioOption(selectedProgramDayId, optionId).catch(() => {});
  };

  // --- Workout session (connects the active program's selected day to the existing logger) ---

  const beginProgramSession = (day: WorkoutDay) => {
    if (!activeProgram) return;
    const newSession = createProgramWorkoutSession(activeProgram.selectedPlanId, day, selectedCardioOptionId);
    setSession(newSession);
    setSessionSummary(null);
    setTab('workout');
  };

  const handleStartWorkout = () => {
    if (!activeProgram || !selectedProgramDay) return;

    if (isEmptyWorkoutDay(selectedProgramDay)) {
      Alert.alert('Rest Day', 'There is nothing planned to log for this day.');
      return;
    }

    const requiredCardioGroup = selectedProgramDay.cardioGroups.find((group) => group.minimumSelections > 0);
    if (requiredCardioGroup && !selectedCardioOptionId) {
      Alert.alert('Choose a Cardio Option', 'Pick a cardio option for this day before starting the workout.');
      return;
    }

    if (session && session.status === 'in-progress' && session.workoutDayId !== selectedProgramDay.id) {
      Alert.alert(
        'Workout In Progress',
        `You have an in-progress workout (${session.workoutName}). Resume it or discard it and start this one?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Resume Existing', onPress: () => setTab('workout') },
          {
            text: 'Discard & Start New',
            style: 'destructive',
            onPress: () => {
              clearSession().catch(() => {});
              beginProgramSession(selectedProgramDay);
            },
          },
        ],
      );
      return;
    }

    if (session && session.status === 'in-progress' && session.workoutDayId === selectedProgramDay.id) {
      setTab('workout');
      return;
    }

    beginProgramSession(selectedProgramDay);
  };

  const handleResumeWorkout = () => setTab('workout');

  const handleCancelSession = () => {
    if (!session) return;
    Alert.alert('Discard this workout?', 'All logged sets and cardio entries for this session will be lost.', [
      { text: 'Keep Logging', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          clearSession().catch(() => {});
          setSession(null);
        },
      },
    ]);
  };

  const handleSessionSetChange = (exerciseId: string, setIndex: number, field: 'weight' | 'reps', value: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const exercise = next.exercises.find((entry) => entry.exerciseId === exerciseId);
      if (!exercise) return prev;
      exercise.sets[setIndex][field] = value;
      return next;
    });
  };

  const handleSessionExerciseFieldChange = (exerciseId: string, field: 'completed' | 'notes', value: boolean | string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const exercise = next.exercises.find((entry) => entry.exerciseId === exerciseId);
      if (!exercise) return prev;
      if (field === 'completed') {
        exercise.completed = value as boolean;
      } else {
        exercise.notes = value as string;
      }
      return next;
    });
  };

  const handleSessionCardioFieldChange = (
    plannedOptionId: string,
    field: keyof Pick<
      SessionCardioEntry,
      'durationMinutes' | 'distanceMiles' | 'rounds' | 'roundDurationSeconds' | 'restSeconds' | 'calories' | 'steps' | 'notes'
    >,
    value: string,
  ) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const entry = next.cardio.find((item) => item.plannedOptionId === plannedOptionId);
      if (!entry) return prev;
      entry[field] = value;
      return next;
    });
  };

  const handleToggleSessionCardioComplete = (plannedOptionId: string) => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = clone(prev);
      const entry = next.cardio.find((item) => item.plannedOptionId === plannedOptionId);
      if (!entry) return prev;
      entry.completed = !entry.completed;
      return next;
    });
  };

  const handleCompleteSession = () => {
    if (!session) return;
    const completedAt = new Date().toISOString();

    const exerciseLogs: ExerciseLog[] = session.exercises.map((sessionExercise) => ({
      name: getExerciseById(sessionExercise.exerciseId)?.name ?? sessionExercise.exerciseId,
      completed: sessionExercise.completed,
      notes: sessionExercise.notes,
      sets: sessionExercise.sets,
    }));

    const cardioNotes = summarizeCardioForHistoryNotes(session);

    setState((prev) => {
      const next = clone(prev);

      const dayLogs: Record<string, ExerciseLog> = {};
      session.exercises.forEach((sessionExercise, index) => {
        dayLogs[sessionExercise.exerciseId] = exerciseLogs[index];
      });
      next.programLogs[session.workoutDayId] = dayLogs;

      next.history = [
        {
          date: completedAt.slice(0, 10),
          day: session.workoutDayId,
          title: session.workoutName,
          logs: exerciseLogs,
          notes: cardioNotes,
        },
        ...(next.history ?? []),
      ];

      return next;
    });

    setSessionSummary(buildSessionSummary(session));
    setSession(null);
    clearSession().catch(() => {});

    recordWorkoutDayCompletion(session.workoutDayId, completedAt).then((result) => {
      if (!result) return;
      setActiveProgram(result);
      const nextDay = result.activePlan.workoutDays[result.currentDayIndex];
      setSessionSummary(buildSessionSummary(session, nextDay?.name));
    });
  };

  const selectedDay = useMemo(
    () => PROGRAM.find((d) => d.day === state.selectedDay) ?? PROGRAM[0],
    [state.selectedDay]
  );

  const selectedLogs = state.logs?.[state.selectedDay] ?? [];
  const currentPhase = PHASES.find((p) => p.key === state.phase) ?? PHASES[0];

  const completion = useMemo(() => {
    let total = 0;
    let complete = 0;

    PROGRAM.forEach((day) => {
      if (day.phase === 'recovery') return;

      (state.logs?.[day.day] ?? []).forEach((exercise) => {
        total += 1;
        if (exercise.completed) complete += 1;
      });
    });

    return total ? Math.round((complete / total) * 100) : 0;
  }, [state.logs]);

  const updateSet = (
    exerciseIndex: number,
    setIndex: number,
    field: 'weight' | 'reps',
    value: string
  ) => {
    setState((prev) => {
      const next = clone(prev);
      next.logs[next.selectedDay] = next.logs[next.selectedDay] ?? [];
      next.logs[next.selectedDay][exerciseIndex].sets[setIndex][field] = value;
      return next;
    });
  };

  const updateExercise = (
    exerciseIndex: number,
    field: 'completed' | 'notes',
    value: boolean | string
  ) => {
    setState((prev) => {
      const next = clone(prev);
      next.logs[next.selectedDay] = next.logs[next.selectedDay] ?? [];
      (next.logs[next.selectedDay][exerciseIndex] as any)[field] = value;
      return next;
    });
  };

  const markDayComplete = () => {
    setState((prev) => {
      const next = clone(prev);
      const dayLogs = next.logs[next.selectedDay] ?? [];

      next.logs[next.selectedDay] = dayLogs.map((x) => ({
        ...x,
        completed: true,
      }));

      const dayInfo = PROGRAM.find((d) => d.day === next.selectedDay) ?? PROGRAM[0];

      next.history = [
        {
          date: new Date().toISOString().slice(0, 10),
          day: dayInfo.day,
          title: dayInfo.title,
          logs: clone(next.logs[next.selectedDay]),
          notes: next.coachNotes ?? '',
        },
        ...(next.history ?? []),
      ];

      return next;
    });

    Alert.alert('Workout Saved', 'Your workout has been added to your history.');
  };

  const resetAll = () => {
    Alert.alert('Reset all data?', 'This clears your saved workout logs on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => setState(createDefaultState()),
      },
    ]);
  };

  const coachPrompt = useMemo(() => {
    const lines = [
      'Help me tweak my workout plan based on my current progress.',
      `Phase: ${currentPhase.label}`,
      `Current day: ${state.selectedDay} - ${selectedDay.title}`,
      `Current bodyweight: ${state.bodyweight || 'not entered'}`,
      `Weekly completion: ${completion}%`,
      "Today's logged performance:",
    ];

    selectedLogs.forEach((exercise) => {
      const sets = (exercise.sets ?? [])
        .map((s, i) => `Set ${i + 1}: ${s.weight || '-'} x ${s.reps || '-'}`)
        .join(', ');

      lines.push(`- ${exercise.name}: ${sets}. Notes: ${exercise.notes || 'none'}`);
    });

    lines.push(`Overall notes: ${state.coachNotes || 'none'}`);
    lines.push('Tell me what to adjust for exercise selection, volume, progression, and recovery.');

    return lines.join('\n');
  }, [state, selectedDay, selectedLogs, currentPhase.label, completion]);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.hero}>
          <Text style={styles.title}>Elite Training Tracker</Text>
          <Text style={styles.subtle}>Offline workout log + progression calculator</Text>

          <View style={styles.row}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Phase</Text>
              <Text style={styles.statValue}>{currentPhase.label}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Week</Text>
              <Text style={styles.statValue}>{completion}%</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Target</Text>
              <Text style={styles.statValue}>{currentPhase.target}</Text>
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                placeholder="Athlete"
                placeholderTextColor="#a1a1aa"
                style={styles.input}
                value={state.athleteName}
                onChangeText={(athleteName) => setState((p) => ({ ...p, athleteName }))}
              />
            </View>

            <View style={styles.fieldHalf}>
              <Text style={styles.label}>Bodyweight</Text>
              <TextInput
                placeholder="lb"
                placeholderTextColor="#a1a1aa"
                keyboardType="decimal-pad"
                style={styles.input}
                value={state.bodyweight}
                onChangeText={(bodyweight) => setState((p) => ({ ...p, bodyweight }))}
              />
            </View>
          </View>

          <View style={styles.row}>
            <Pressable style={styles.primaryButton} onPress={markDayComplete}>
              <Text style={styles.primaryButtonText}>Complete Day</Text>
            </Pressable>

            <Pressable style={styles.secondaryButton} onPress={resetAll}>
              <Text style={styles.secondaryButtonText}>Reset</Text>
            </Pressable>
          </View>
        </View>

        <BottomTabs activeTab={tab} onChangeTab={setTab} />

        {tab === 'workout' && (
          <View style={styles.section}>
            {session ? (
              <SessionWorkoutScreen
                session={session}
                planName={activeProgram?.activePlan.name ?? ''}
                onUpdateExerciseSet={handleSessionSetChange}
                onUpdateExerciseField={handleSessionExerciseFieldChange}
                onUpdateCardioField={handleSessionCardioFieldChange}
                onToggleCardioComplete={handleToggleSessionCardioComplete}
                onComplete={handleCompleteSession}
                onCancel={handleCancelSession}
              />
            ) : sessionSummary ? (
              <WorkoutSummaryCard
                summary={sessionSummary}
                onDone={() => {
                  setSessionSummary(null);
                  setTab('programs');
                  setProgramsView('active');
                }}
              />
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayPills}>
                  {PROGRAM.map((day) => (
                    <Pressable
                      key={day.day}
                      style={[styles.dayPill, state.selectedDay === day.day && styles.dayPillActive]}
                      onPress={() => {
                        setState((p) => ({ ...p, selectedDay: day.day }));
                      }}
                    >
                      <Text style={[styles.dayPillText, state.selectedDay === day.day && styles.dayPillTextActive]}>
                        {day.day.slice(0, 3)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.cardTitle}>{selectedDay.day}</Text>
                      <Text style={styles.subtle}>{selectedDay.title}</Text>
                    </View>

                    <Text style={styles.badge}>
                      {selectedLogs.filter((x) => x.completed).length}/{selectedLogs.length}
                    </Text>
                  </View>

                  {selectedDay.exercises.map((exercise, exerciseIndex) => {
                    const log = selectedLogs[exerciseIndex];
                    if (!log) return null;

                    return (
                      <ExerciseLogCard
                        key={exercise.name}
                        title={exercise.name}
                        meta={`${exercise.sets} sets • ${exercise.repRange}`}
                        log={log}
                        recommendation={getRecommendation(exercise, log)}
                        onUpdateSet={(setIndex, field, value) => updateSet(exerciseIndex, setIndex, field, value)}
                        onUpdateField={(field, value) => updateExercise(exerciseIndex, field, value)}
                      />
                    );
                  })}
                </View>
              </>
            )}
          </View>
        )}

        {tab === 'programs' && (
          <View style={styles.section}>
            {activeProgram && programsView === 'active' && selectedProgramDay ? (
              <ActiveProgramScreen
                activeProgram={activeProgram}
                selectedDayId={selectedProgramDay.id}
                onSelectDayId={setSelectedProgramDayId}
                selectedCardioOptionId={selectedCardioOptionId}
                onSelectCardioOption={handleSelectCardioOption}
                onPlanChange={handleProgramPlanChange}
                onResetPlan={handleResetProgramPlan}
                onBrowsePlans={() => setProgramsView('browse')}
                activeSessionDayId={session?.status === 'in-progress' ? session.workoutDayId : null}
                onStartWorkout={handleStartWorkout}
                onResumeWorkout={handleResumeWorkout}
              />
            ) : (
              <ProgramsScreen
                activeProgram={activeProgram}
                onSelectPlan={handleSelectPlan}
                onOpenActiveProgram={() => setProgramsView('active')}
                hasActiveSession={session?.status === 'in-progress'}
                onResumeWorkout={handleResumeWorkout}
              />
            )}
          </View>
        )}

        {tab === 'history' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Workout History</Text>
            <Text style={styles.subtle}>Saved completed workouts from this device.</Text>

            {(state.history ?? []).length === 0 ? (
              <Text style={styles.bodyText}>No workouts saved yet.</Text>
            ) : (
              (state.history ?? []).map((workout, index) => (
                <View key={`${workout.date}-${index}`} style={styles.weighInCard}>
                  <Text style={styles.exerciseTitle}>
                    {workout.date} • {workout.day}
                  </Text>

                  <Text style={styles.subtle}>{workout.title}</Text>

                  {(workout.logs ?? []).map((exercise) => (
                    <View key={exercise.name} style={{ marginTop: 10 }}>
                      <Text style={styles.label}>{exercise.name}</Text>

                      <Text style={styles.bodyText}>
                        {(exercise.sets ?? [])
                          .map((set, i) => `Set ${i + 1}: ${set.weight || '-'} x ${set.reps || '-'}`)
                          .join(' | ')}
                      </Text>

                      {exercise.notes ? (
                        <Text style={styles.subtle}>Notes: {exercise.notes}</Text>
                      ) : null}
                    </View>
                  ))}

                  {workout.notes ? (
                    <Text style={styles.subtle}>Coach notes: {workout.notes}</Text>
                  ) : null}
                </View>
              ))
            )}
          </View>
        )}

        {tab === 'weight' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Weight Log</Text>
            <Text style={styles.subtle}>Track bodyweight separately from daily workout weight.</Text>

            {(state.weighIns ?? []).map((row, index) => (
              <View key={index} style={styles.weighInCard}>
                <Text style={styles.label}>Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#a1a1aa"
                  value={row.date}
                  onChangeText={(date) => {
                    setState((prev) => {
                      const next = clone(prev);
                      next.weighIns[index].date = date;
                      return next;
                    });
                  }}
                />

                <View style={styles.divider} />

                <Text style={styles.label}>Bodyweight (lbs)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter weight"
                  placeholderTextColor="#a1a1aa"
                  keyboardType="decimal-pad"
                  value={row.weight}
                  onChangeText={(weight) => {
                    setState((prev) => {
                      const next = clone(prev);
                      next.weighIns[index].weight = weight;
                      return next;
                    });
                  }}
                />
              </View>
            ))}

            <Pressable
              style={styles.secondaryButtonFull}
              onPress={() =>
                setState((p) => ({
                  ...p,
                  weighIns: [
                    ...(p.weighIns ?? []),
                    { date: new Date().toISOString().slice(0, 10), weight: '' },
                  ],
                }))
              }
            >
              <Text style={styles.secondaryButtonText}>Add Weigh-In</Text>
            </Pressable>
          </View>
        )}

        {tab === 'coach' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Coach Assistant</Text>
            <Text style={styles.subtle}>Paste this into ChatGPT so I can tweak your plan from real logs.</Text>

            <TextInput
              style={[styles.input, styles.notes]}
              placeholder="Overall weekly notes"
              placeholderTextColor="#a1a1aa"
              multiline
              value={state.coachNotes}
              onChangeText={(coachNotes) => setState((p) => ({ ...p, coachNotes }))}
            />

            <TextInput
              style={[styles.input, styles.promptBox]}
              multiline
              editable={false}
              value={coachPrompt}
            />

            <Pressable style={styles.primaryButton} onPress={() => Alert.alert('Prompt ready', coachPrompt)}>
              <Text style={styles.primaryButtonText}>Show Coaching Prompt</Text>
            </Pressable>
          </View>
        )}

        {tab === 'settings' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Phase Settings</Text>
            <Text style={styles.subtle}>Pick your current training phase.</Text>

            {PHASES.map((phase) => (
              <Pressable
                key={phase.key}
                style={[styles.phaseCard, state.phase === phase.key && styles.phaseCardActive]}
                onPress={() => setState((p) => ({ ...p, phase: phase.key }))}
              >
                <Text style={styles.exerciseTitle}>{phase.label}</Text>
                <Text style={styles.subtle}>Target: {phase.target}</Text>
                <Text style={styles.bodyText}>{phase.note}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: { flex: 1, backgroundColor: '#09090b' },
  scroll: { padding: 14, paddingBottom: 40 },
  hero: { backgroundColor: '#18181b', borderRadius: 28, padding: 18, borderWidth: 1, borderColor: '#3f3f46' },
  title: { color: 'white', fontSize: 28, fontWeight: '800' },
  subtle: { color: '#d4d4d8', fontSize: 13, marginTop: 4 },
  row: { flexDirection: 'row', gap: 10, marginTop: 14 },
  stat: { flex: 1, backgroundColor: '#27272a', borderRadius: 18, padding: 10, borderWidth: 1, borderColor: '#52525b' },
  statLabel: { color: '#a1a1aa', fontSize: 11 },
  statValue: { color: 'white', fontSize: 13, fontWeight: '700', marginTop: 4 },
  fieldHalf: { flex: 1 },
  label: { color: '#d4d4d8', fontSize: 12, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#27272a', color: 'white', borderColor: '#52525b', borderWidth: 1, borderRadius: 16, padding: 12 },
  primaryButton: { flex: 1, backgroundColor: 'white', borderRadius: 18, padding: 13, alignItems: 'center', marginTop: 12 },
  primaryButtonText: { color: '#09090b', fontWeight: '800' },
  secondaryButton: { backgroundColor: '#27272a', borderColor: '#52525b', borderWidth: 1, borderRadius: 18, padding: 13, alignItems: 'center' },
  secondaryButtonFull: { backgroundColor: '#27272a', borderColor: '#52525b', borderWidth: 1, borderRadius: 18, padding: 13, alignItems: 'center', marginTop: 8 },
  secondaryButtonText: { color: 'white', fontWeight: '700' },
  section: { gap: 12 },
  dayPills: { gap: 8, paddingVertical: 4 },
  dayPill: { backgroundColor: '#27272a', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 16, borderWidth: 1, borderColor: '#52525b' },
  dayPillActive: { backgroundColor: 'white', borderColor: 'white' },
  dayPillText: { color: 'white', fontWeight: '700' },
  dayPillTextActive: { color: '#09090b' },
  card: { backgroundColor: '#18181b', borderRadius: 28, padding: 16, borderWidth: 1, borderColor: '#3f3f46', marginTop: 12 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' },
  cardTitle: { color: 'white', fontSize: 22, fontWeight: '800' },
  badge: { color: 'white', backgroundColor: '#27272a', borderRadius: 12, overflow: 'hidden', paddingHorizontal: 10, paddingVertical: 6, fontWeight: '700' },
  exerciseTitle: { color: 'white', fontSize: 15, fontWeight: '800' },
  bodyText: { color: '#f4f4f5', fontSize: 13, lineHeight: 19 },
  notes: { minHeight: 90, textAlignVertical: 'top', marginTop: 12 },
  weighInCard: { backgroundColor: '#27272a', borderRadius: 20, padding: 14, borderWidth: 1, borderColor: '#52525b', marginTop: 12 },
  divider: { height: 1, backgroundColor: '#52525b', marginVertical: 14 },
  promptBox: { minHeight: 260, textAlignVertical: 'top', marginTop: 12 },
  phaseCard: { backgroundColor: '#27272a', borderRadius: 18, padding: 14, borderWidth: 1, borderColor: '#52525b', marginTop: 12 },
  phaseCardActive: { borderColor: 'white', backgroundColor: '#3f3f46' },
});