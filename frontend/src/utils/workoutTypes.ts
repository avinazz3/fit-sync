export interface PlannedSet {
  targetRepsDisplay: string; // e.g., "6-10 reps", "5 reps", "AMRAP"
  previousPerformanceDisplay?: string; // e.g., "40 kg x 8 reps", "Bodyweight x 10 reps"
  // We might add structured data later if needed for calculations, e.g.:
  // targetMinReps?: number;
  // targetMaxReps?: number;
  // previousWeight?: number;
  // previousReps?: number;
}

export interface PerformedSet {
  id: string; // Unique ID for the performed set
  performedWeight: number | null; // Actual weight lifted
  performedReps: number | null; // Actual reps performed
  completed: boolean; // Marked by the user as done
}

export interface ActiveExerciseLog {
  id: string; // Unique ID for this instance of the exercise in the workout (e.g., from the generated plan)
  exerciseName: string; // e.g., "Overhead Press (Barbell)"
  exerciseDetail?: string; // e.g., "BB or DB Overhead Press" - the main title for the exercise card
  byNaturalHypertrophy?: string; // e.g., "By Natural Hypertrophy" - the subtitle
  plannedSets: PlannedSet[];
  performedSets: PerformedSet[]; // User will add to this array as they complete sets
}

export interface ActiveWorkoutSession {
  id: string; // Unique ID for this active workout session (could be same as a plan ID if it's a direct performance of a plan)
  planName?: string; // Optional name of the workout plan being performed (e.g., "Push Day A")
  date: string; // ISO string format for the date the workout was started/performed
  exercises: ActiveExerciseLog[];
  notes?: string; // Optional notes about how the workout felt
  startTime?: string; // ISO string for when the workout was started
  endTime?: string; // ISO string for when the workout was finished
  status: "active" | "completed" | "aborted"; // Status of the workout session
}

// The structure saved to localStorage after a workout is 'completed' might be simpler,
// focusing on what was actually performed. For now, local storage will use ActiveWorkoutSession.
// We can refine this later if needed, for example, a simpler WorkoutRecord type:
/*
export interface WorkoutRecordSet {
  weight: number;
  reps: number;
}
export interface WorkoutRecordExercise {
  name: string;
  sets: WorkoutRecordSet[];
}
export interface WorkoutRecord {
  id: string;
  date: string;
  planName?: string;
  exercises: WorkoutRecordExercise[];
  notes?: string;
  durationMinutes?: number;
}
*/
