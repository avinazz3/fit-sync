import { toast } from "sonner";

// Define the structure for a single logged set
export interface LoggedExerciseSet {
  id: string;
  reps: number | string; // Actual reps performed, e.g., 10 or "AMRAP"
  weight?: number;        // Actual weight lifted
  completed: boolean;
}

// Define the structure for a logged exercise within a workout
export interface LoggedExercise {
  id: string;                 // Original exercise ID
  name: string;               // Exercise name
  targetReps?: string;       // Original target reps, e.g., "3 sets of 10-12 reps"
  loggedSets: LoggedExerciseSet[]; // Array of actually performed sets
  notes?: string;             // Optional notes specific to this exercise
}

// Define the structure for a completed workout session
export interface LoggedWorkout {
  id: string;                 // Unique ID for this workout instance (e.g., workoutPlan.id from WorkoutDetailsPage)
  planName?: string;           // Name of the workout plan used
  startTime: string;          // ISO string
  endTime: string;            // ISO string
  programDayTag?: string;    // e.g., "Week 4 - Day 1", added for future use
  durationMinutes: number;
  exercises: LoggedExercise[];
  overallNotes?: string;       // Optional overall notes for the session
}

const WORKOUT_HISTORY_KEY = "workoutHistory";

/**
 * Saves a completed workout session to local storage.
 * @param workoutData - The workout session data to save.
 */
export const saveWorkoutToHistory = (workoutData: LoggedWorkout): void => {
  try {
    const history: LoggedWorkout[] = getWorkoutHistory();
    history.push(workoutData);
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
    console.log("Workout saved to history:", workoutData);
  } catch (error) {
    console.error("Failed to save workout to history:", error);
    toast.error("Oops! Could not save your workout. Please try again.");
  }
};

/**
 * Retrieves all workout sessions from local storage.
 * @returns An array of LoggedWorkout objects, or an empty array if none found or on error.
 */
export const getWorkoutHistory = (): LoggedWorkout[] => {
  try {
    const historyJson = localStorage.getItem(WORKOUT_HISTORY_KEY);
    if (historyJson) {
      const workouts = JSON.parse(historyJson) as LoggedWorkout[];
      if (workouts.length > 0) {
        return workouts;
      }
    }
    // If history is empty or parsing fails/results in empty, return a dummy workout for visualization
    console.log("No actual workout history found, providing dummy data for ProgressPage visualization.");
    const today = new Date();
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

    return [
      {
        id: "dummy-workout-001",
        planName: "Ultimate Hypertrophy: Novice",
        startTime: new Date(today.setHours(9, 0, 0, 0)).toISOString(), // Today at 9:00 AM
        endTime: new Date(today.setHours(10, 15, 0, 0)).toISOString(), // Today at 10:15 AM (75 mins later)
        programDayTag: "Week 4 - Day 1",
        durationMinutes: 75,
        exercises: [
          {
            id: "ex1-dummy",
            name: "Barbell Squat",
            targetReps: "3 sets of 8-12 reps",
            loggedSets: [
              { id: "s1-1-dummy", reps: 10, weight: 90, completed: true },
              { id: "s1-2-dummy", reps: 8, weight: 100, completed: true },
              { id: "s1-3-dummy", reps: 8, weight: 100, completed: true },
            ],
          },
          {
            id: "ex2-dummy",
            name: "EZ Bar Bicep Curl",
            targetReps: "3 sets of 10-15 reps",
            loggedSets: [
              { id: "s2-1-dummy", reps: 12, weight: 12, completed: true },
              { id: "s2-2-dummy", reps: 10, weight: 12, completed: true },
              { id: "s2-3-dummy", reps: "AMRAP", weight: 10, completed: true }, // Example of AMRAP string reps
            ],
          },
          {
            id: "ex3-dummy",
            name: "Weighted Dips",
            targetReps: "3 sets to failure",
            loggedSets: [
              { id: "s3-1-dummy", reps: "15 reps", weight: 0, completed: true }, // Example of string reps
              { id: "s3-2-dummy", reps: 12, weight: 5, completed: true }, 
              { id: "s3-3-dummy", reps: 10, weight: 5, completed: true },
            ],
          },
        ],
        overallNotes: "Felt strong on squats, biceps were a bit fatigued."
      },
      {
        id: "dummy-workout-002",
        planName: "Full Body Blast",
        startTime: new Date(twoDaysAgo.setHours(14,0,0,0)).toISOString(), // 2 days ago at 2 PM
        endTime: new Date(twoDaysAgo.setHours(15,0,0,0)).toISOString(),   // 2 days ago at 3 PM (60 mins later)
        // programDayTag: "Phase 2 - Workout B", // Example of a different tag or no tag
        durationMinutes: 60,
        exercises: [
          {
            id: "exA-dummy",
            name: "Deadlifts",
            targetReps: "1 set of 5 reps",
            loggedSets: [
              { id: "sA-1-dummy", reps: 5, weight: 135, completed: true },
            ],
          },
          {
            id: "exB-dummy",
            name: "Overhead Press",
            targetReps: "3 sets of 5-8 reps",
            loggedSets: [
              { id: "sB-1-dummy", reps: 8, weight: 40, completed: true },
              { id: "sB-2-dummy", reps: 6, weight: 45, completed: true },
              { id: "sB-3-dummy", reps: 5, weight: 45, completed: true },
            ],
          },
        ],
        overallNotes: "Quick and effective session."
      }
    ];
  } catch (error) {
    console.error("Failed to retrieve or create dummy workout history:", error);
    return [];
  }
};

// Future functions:
// - getWorkoutById(id: string): LoggedWorkout | undefined
// - deleteWorkout(id: string): void
// - updateWorkout(id: string, updatedData: Partial<LoggedWorkout>): void
// - clearWorkoutHistory(): void
