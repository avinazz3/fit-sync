import { WorkoutSession } from "./workoutTypes";

const WORKOUT_SESSIONS_KEY = "workoutSessions";

/**
 * Retrieves all workout sessions from local storage.
 * @returns {WorkoutSession[]} An array of workout sessions, or an empty array if none are found.
 */
export const getAllWorkoutSessions = (): WorkoutSession[] => {
  try {
    const sessionsJson = localStorage.getItem(WORKOUT_SESSIONS_KEY);
    return sessionsJson ? JSON.parse(sessionsJson) : [];
  } catch (error) {
    console.error("Error retrieving workout sessions from local storage:", error);
    return [];
  }
};

/**
 * Saves a workout session to local storage.
 * If a session with the same ID already exists, it will be updated.
 * Otherwise, the new session will be added to the list.
 * @param {WorkoutSession} session - The workout session to save.
 */
export const saveWorkoutSession = (session: WorkoutSession): void => {
  try {
    const sessions = getAllWorkoutSessions();
    const existingSessionIndex = sessions.findIndex((s) => s.id === session.id);

    if (existingSessionIndex > -1) {
      sessions[existingSessionIndex] = session; // Update existing session
    } else {
      sessions.push(session); // Add new session
    }
    localStorage.setItem(WORKOUT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving workout session to local storage:", error);
  }
};

/**
 * Retrieves a specific workout session by its ID.
 * @param {string} sessionId - The ID of the workout session to retrieve.
 * @returns {WorkoutSession | undefined} The workout session if found, otherwise undefined.
 */
export const getWorkoutSessionById = (sessionId: string): WorkoutSession | undefined => {
  try {
    const sessions = getAllWorkoutSessions();
    return sessions.find((s) => s.id === sessionId);
  } catch (error) {
    console.error("Error retrieving workout session by ID from local storage:", error);
    return undefined;
  }
};

/**
 * Deletes a workout session by its ID from local storage.
 * @param {string} sessionId - The ID of the workout session to delete.
 */
export const deleteWorkoutSession = (sessionId: string): void => {
  try {
    let sessions = getAllWorkoutSessions();
    sessions = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(WORKOUT_SESSIONS_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error deleting workout session from local storage:", error);
  }
};

/**
 * Generates a simple unique ID (for client-side use).
 * Replace with a more robust UUID generator if needed for larger scale or backend integration.
 * @returns {string} A unique string.
 */
export const generateUniqueId = (): string => {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2)}`;
};
