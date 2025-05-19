import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface OnboardingData {
  fitnessGoal: string | null;
  injuries: string[];
  workoutDuration: number | null; // in minutes
  workoutFrequency: number | null; // days per week
  availableEquipment: string[];
}

interface OnboardingState extends OnboardingData {
  currentStep: number;
  totalSteps: number;
  setFitnessGoal: (goal: string) => void;
  setInjuries: (injuries: string[]) => void;
  setWorkoutDuration: (duration: number) => void;
  setWorkoutFrequency: (frequency: number) => void;
  setAvailableEquipment: (equipment: string[]) => void;
  nextStep: () => void;
  prevStep: () => void;
  resetOnboarding: () => void;
  isCompleted: () => boolean;
}

const initialData: OnboardingData = {
  fitnessGoal: null,
  injuries: [],
  workoutDuration: null,
  workoutFrequency: null,
  availableEquipment: [],
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      ...initialData,
      currentStep: 1,
      totalSteps: 4, // Assuming 4 steps for now: Goals, Injuries, Preferences, Equipment

      setFitnessGoal: (goal) => set({ fitnessGoal: goal }),
      setInjuries: (injuries) => set({ injuries }),
      setWorkoutDuration: (duration) => set({ workoutDuration: duration }),
      setWorkoutFrequency: (frequency) => set({ workoutFrequency: frequency }),
      setAvailableEquipment: (equipment) => set({ availableEquipment: equipment }),

      nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, state.totalSteps + 1) })),
      prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),

      resetOnboarding: () => set({ ...initialData, currentStep: 1 }),
      isCompleted: () => get().currentStep > get().totalSteps,
    }),
    {
      name: 'wellnash-onboarding-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ // Only persist these fields
        fitnessGoal: state.fitnessGoal,
        injuries: state.injuries,
        workoutDuration: state.workoutDuration,
        workoutFrequency: state.workoutFrequency,
        availableEquipment: state.availableEquipment,
      }),
    }
  )
);
