import { LoggedWorkout, LoggedExerciseSet, LoggedExercise } from "./workoutManager";
import { PlayCircle, CalendarCheck, Activity, Dumbbell, TrendingUp, Award } from 'lucide-react'; // Keep Award for flexibility

// Interfaces
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: keyof typeof import('lucide-react'); // Type for Lucide icon names
  isEarned?: boolean; // To be populated by checking logic
  earnedDate?: string; // ISO string
  // Condition function: takes workout history and returns true if badge earned
  condition: (history: LoggedWorkout[], allBadges?: Badge[]) => boolean; 
}

const EARNED_BADGES_STORAGE_KEY = "fitSyncEarnedBadges";

// Helper: Calculate total volume for a workout (moved from ProgressPage)
export const calculateTotalVolume = (workout: LoggedWorkout): number => {
  return workout.exercises.reduce((totalVol, exercise) => {
    return totalVol + exercise.loggedSets.reduce((exerciseVol, set) => {
      if (set.completed && typeof set.reps === 'number' && typeof set.weight === 'number') {
        return exerciseVol + (set.reps * set.weight);
      }
      return exerciseVol;
    }, 0);
  }, 0);
};

// --- Badge Definitions ---
export const allBadges: Badge[] = [
  {
    id: "firstSteps",
    name: "First Steps",
    description: "Logged your very first workout!",
    iconName: "PlayCircle",
    condition: (history) => history.length >= 1,
  },
  {
    id: "workoutWeek",
    name: "Workout Week",
    description: "Completed 3 workouts in the last 7 days.",
    iconName: "CalendarCheck",
    condition: (history) => {
      if (history.length < 3) return false;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentWorkouts = history.filter(workout => new Date(workout.endTime) >= sevenDaysAgo);
      return recentWorkouts.length >= 3;
    },
  },
  {
    id: "volumeMover",
    name: "Volume Mover",
    description: "Lifted over 5,000 kg total volume in a single workout.",
    iconName: "Dumbbell",
    condition: (history) => {
      return history.some(workout => calculateTotalVolume(workout) >= 5000);
    },
  },
  // Add more badges here
];

// --- Achievement Logic ---

/**
 * Retrieves all earned badge IDs and their earned dates from local storage.
 * @returns Record<string, string> - A map of badgeId to ISO earnedDate.
 */
const getEarnedBadgesDataFromStorage = (): Record<string, string> => {
  const storedData = localStorage.getItem(EARNED_BADGES_STORAGE_KEY);
  if (storedData) {
    try {
      return JSON.parse(storedData);
    } catch (e) {
      console.error("Error parsing earned badges from storage:", e);
      return {};
    }
  }
  return {};
};

/**
 * Saves a newly earned badge's ID and earned date to local storage.
 * @param badgeId - The ID of the badge.
 * @param earnedDate - ISO string of when it was earned.
 */
const saveEarnedBadgeDataToStorage = (badgeId: string, earnedDate: string): void => {
  const earnedBadges = getEarnedBadgesDataFromStorage();
  earnedBadges[badgeId] = earnedDate;
  localStorage.setItem(EARNED_BADGES_STORAGE_KEY, JSON.stringify(earnedBadges));
};

/**
 * Checks all defined badges against the workout history and local storage
 * to determine which badges are earned and when.
 * @param workoutHistory - The user's logged workout history.
 * @returns Badge[] - An array of Badge objects, with isEarned and earnedDate populated.
 */
export const checkAndGetAllEarnedBadges = (workoutHistory: LoggedWorkout[]): Badge[] => {
  const earnedBadgesData = getEarnedBadgesDataFromStorage();
  const evaluatedBadges: Badge[] = [];

  for (const badgeDef of allBadges) {
    let isEarned = false;
    let earnedDate = undefined;

    if (earnedBadgesData[badgeDef.id]) {
      isEarned = true;
      earnedDate = earnedBadgesData[badgeDef.id];
    } else {
      // Not in storage, check condition
      if (badgeDef.condition(workoutHistory, allBadges)) {
        isEarned = true;
        earnedDate = new Date().toISOString(); // Earned now
        saveEarnedBadgeDataToStorage(badgeDef.id, earnedDate);
        // console.log(`Newly earned badge: ${badgeDef.name}`); // For debugging
      }
    }
    
    evaluatedBadges.push({
      ...badgeDef,
      isEarned,
      earnedDate,
    });
  }
  // Return only the badges that are actually marked as earned
  return evaluatedBadges.filter(b => b.isEarned);
};
