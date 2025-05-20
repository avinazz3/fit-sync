import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ActiveWorkoutSession, ActiveExerciseLog, PlannedSet, PerformedSet } from "utils/workoutTypes";
import { saveWorkoutSession, generateUniqueId, getWorkoutSessionById, getAllWorkoutSessions } from "utils/workoutStorage"; // Assuming these are updated
import { Toaster, toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, PlusCircle, CheckCircle2, XCircle, Edit3, Trash2, Timer, Calculator, Play, Pause, SkipForward } from "lucide-react";
import { AnimatedBackground } from "./components/animated-background";

// Mock data for a generated workout plan - this would normally come from props or a state management solution
const MOCK_GENERATED_WORKOUT_ID = "mock-plan-123";
const MOCK_GENERATED_EXERCISES: ActiveExerciseLog[] = [
  {
    id: "ex1",
    exerciseName: "1A Overhead Press (Barbell)",
    exerciseDetail: "BB or DB Overhead Press",
    byNaturalHypertrophy: "By Natural Hypertrophy",
    plannedSets: [
      { targetRepsDisplay: "6-10 reps", previousPerformanceDisplay: "40 kg x 8" },
      { targetRepsDisplay: "6-10 reps", previousPerformanceDisplay: "50 kg x 5" },
      { targetRepsDisplay: "6-10 reps", previousPerformanceDisplay: "50 kg x 5" },
    ],
    performedSets: [],
  },
  {
    id: "ex2",
    exerciseName: "1B Hammer Curl",
    exerciseDetail: "Hammer Curl or Reverse Curl",
    byNaturalHypertrophy: "By Natural Hypertrophy",
    plannedSets: [
      { targetRepsDisplay: "8-12 reps", previousPerformanceDisplay: "14 kg x 12" },
      { targetRepsDisplay: "8-12 reps", previousPerformanceDisplay: "14 kg x 12" },
      { targetRepsDisplay: "8-12 reps", previousPerformanceDisplay: "14 kg x 12" },
    ],
    performedSets: [],
  },
  {
    id: "ex3",
    exerciseName: "2A Neutral Grip Pull-Up",
    exerciseDetail: "Neutral Grip Pull-Ups (Weighted) or Neutral Grip Pulldowns",
    byNaturalHypertrophy: "By Natural Hypertrophy",
    plannedSets: [
      { targetRepsDisplay: "AMRAP", previousPerformanceDisplay: "BW x 10" },
      { targetRepsDisplay: "AMRAP", previousPerformanceDisplay: "BW x 8" },
    ],
    performedSets: [],
  },
];

const ActiveWorkoutPage = () => {
  const navigate = useNavigate();
  // const { sessionId } = useParams<{ sessionId: string }>(); // If we load existing active session by ID
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Initialize or load an active session
  useEffect(() => {
    // For now, always start a new session based on mock data
    // In a real app, you'd check if there's an existing active session to resume
    // or load a specific plan to start.
    const newSession: ActiveWorkoutSession = {
      id: MOCK_GENERATED_WORKOUT_ID, // Or generateUniqueId() if it's a new performance
      planName: "Mock Hypertrophy Plan A",
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      exercises: MOCK_GENERATED_EXERCISES.map(ex => ({
        ...ex,
        // Initialize performedSets to match plannedSets structure for UI binding
        performedSets: ex.plannedSets.map(() => ({
          id: generateUniqueId(),
          performedReps: null,
          performedWeight: null,
          completed: false,
        }))
      })),
      status: "active",
    };
    setActiveSession(newSession);
    setIsTimerRunning(true);
  }, []);

 useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && activeSession?.status === 'active') {
      interval = setInterval(() => {
        setSessionTimer(prevTime => prevTime + 1);
      }, 1000);
    } else if (!isTimerRunning && sessionTimer !== 0 && interval) {
      clearInterval(interval);
    }
    return () => { if(interval) clearInterval(interval); };
  }, [isTimerRunning, activeSession]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };


  const handlePerformedSetChange = (
    exerciseId: string,
    setIndex: number,
    field: keyof Omit<PerformedSet, "id" | "completed">, // Only allow changing reps/weight
    value: string
  ) => {
    if (!activeSession) return;

    const numericValue = value === "" ? null : parseInt(value, 10);
    if (value !== "" && (isNaN(numericValue!) || numericValue! < 0)) return; // Allow clearing, disallow negative/invalid

    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const updatedPerformedSets = ex.performedSets.map((ps, idx) => {
          if (idx === setIndex) {
            return { ...ps, [field]: numericValue };
          }
          return ps;
        });
        return { ...ex, performedSets: updatedPerformedSets };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const toggleSetCompletion = (exerciseId: string, setIndex: number) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const updatedPerformedSets = ex.performedSets.map((ps, idx) => {
          if (idx === setIndex) {
            // If marking complete, and reps/weight are null, maybe prompt or set to 0?
            // For now, just toggle. User should fill values.
            return { ...ps, completed: !ps.completed };
          }
          return ps;
        });
        return { ...ex, performedSets: updatedPerformedSets };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const handleAddSet = (exerciseId: string) => {
    if (!activeSession) return;
    const updatedExercises = activeSession.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        // Add a new empty performed set. A corresponding planned set might not exist or be different.
        const newPerformedSet: PerformedSet = {
          id: generateUniqueId(),
          performedReps: null,
          performedWeight: null,
          completed: false,
        };
        // Also add a placeholder plannedSet for UI consistency if it's an extra set
        const newPlannedSet: PlannedSet = { targetRepsDisplay: "Added Set"}

        return {
          ...ex,
          plannedSets: [...ex.plannedSets, newPlannedSet],
          performedSets: [...ex.performedSets, newPerformedSet],
        };
      }
      return ex;
    });
    setActiveSession({ ...activeSession, exercises: updatedExercises });
  };

  const handleFinishWorkout = () => {
    if (!activeSession) return;
    const finishedSession: ActiveWorkoutSession = {
      ...activeSession,
      status: "completed",
      endTime: new Date().toISOString(),
      notes: activeSession.notes, // Assuming notes could be added during workout
    };
    saveWorkoutSession(finishedSession);
    setIsTimerRunning(false);
    toast.success("Workout Finished & Saved!");
    navigate("/dashboard"); // Navigate to dashboard
  };

  if (!activeSession) {
    return (
      <div className="min-h-screen bg-black p-8 flex items-center justify-center relative">
        {/* Background gradient */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />
        <div className="text-white text-center text-xl font-semibold relative z-10">Loading workout...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-4 sm:p-6 md:p-8 relative">
      {/* Animated background */}
      <AnimatedBackground type="particles" opacity={0.2} speed={0.8} />
      
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col flex-grow">
      <Toaster richColors position="top-center" />
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-gray-300 hover:text-white">
          <ChevronLeft size={28} />
        </Button>
        <div className="flex items-center space-x-2 bg-gray-800/60 backdrop-blur-sm px-3 py-2 rounded-md border border-gray-700 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
            {isTimerRunning ? <Play size={20} className="text-green-400"/> : <Pause size={20} className="text-yellow-400"/>}
            <span className="font-mono text-xl">{formatTime(sessionTimer)}</span>
        </div>
        <Button onClick={handleFinishWorkout} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg">
          Finish
        </Button>
      </header>

      {/* Exercises List */}
      <main className="flex-grow space-y-6 overflow-y-auto pb-20"> {/* Added pb for footer */}
        {activeSession.exercises.map((exercise, exIdx) => (
          <Card key={exercise.id} className="bg-gray-800/60 border-gray-700 shadow-[0_0_15px_rgba(139,92,246,0.15)] backdrop-blur-sm rounded-lg overflow-hidden">
            <CardHeader className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800/80 to-gray-900/80">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-semibold text-purple-400 tracking-wide">
                  {exercise.exerciseName} {/* e.g. 1A Overhead Press (Barbell) */}
                </h3>
                {/* Placeholder for icons like swap, info */}
                <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Edit3 size={18}/></Button>
                    <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white"><Trash2 size={18}/></Button>
                </div>
              </div>
              <CardTitle className="text-xl font-bold mt-1 text-white">
                {exercise.exerciseDetail} {/* e.g. BB or DB Overhead Press */}
              </CardTitle>
              {exercise.byNaturalHypertrophy && (
                <p className="text-xs text-blue-400 mt-0.5">{exercise.byNaturalHypertrophy}</p>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {/* Sets Table Header */}
              <div className="grid grid-cols-12 gap-x-2 px-4 py-2 text-xs font-medium text-gray-400 border-b border-gray-700 bg-gray-800/50">
                <div className="col-span-1">Set</div>
                <div className="col-span-4">Previous</div>
                <div className="col-span-3">Target</div>
                <div className="col-span-2">kg</div>
                <div className="col-span-1">Reps</div>
                <div className="col-span-1 text-center">✓</div>
              </div>
              {/* Sets Rows */}
              {exercise.performedSets.map((pSet, setIdx) => {
                const plannedSet = exercise.plannedSets[setIdx] || { targetRepsDisplay: "-", previousPerformanceDisplay: "-" }; // Fallback if performedSets > plannedSets
                return (
                  <div key={pSet.id} className={`grid grid-cols-12 gap-x-2 px-4 py-3 items-center border-b border-gray-700 last:border-b-0 ${pSet.completed ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/20' : 'hover:bg-gray-700/30'} transition-colors duration-200`}>
                    <div className="col-span-1 text-sm font-medium text-gray-300">{setIdx + 1}</div>
                    <div className="col-span-4 text-sm text-gray-400 truncate" title={plannedSet.previousPerformanceDisplay}>{plannedSet.previousPerformanceDisplay}</div>
                    <div className="col-span-3 text-sm text-gray-400 truncate" title={plannedSet.targetRepsDisplay}>{plannedSet.targetRepsDisplay}</div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        placeholder="-"
                        value={pSet.performedWeight === null ? "" : pSet.performedWeight}
                        onChange={(e) => handlePerformedSetChange(exercise.id, setIdx, "performedWeight", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white h-8 text-sm p-1.5 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1">
                      <Input
                        type="number"
                        placeholder="-"
                        value={pSet.performedReps === null ? "" : pSet.performedReps}
                        onChange={(e) => handlePerformedSetChange(exercise.id, setIdx, "performedReps", e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white h-8 text-sm p-1.5 w-full rounded-md focus:ring-purple-500 focus:border-purple-500"
                        min="0"
                      />
                    </div>
                    <div className="col-span-1 flex justify-center items-center">
                      <Checkbox
                        id={`completed-${pSet.id}`}
                        checked={pSet.completed}
                        onCheckedChange={() => toggleSetCompletion(exercise.id, setIdx)}
                        className="form-checkbox h-5 w-5 text-purple-500 bg-gray-700 border-gray-600 rounded focus:ring-purple-600 accent-purple-500"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
            <CardFooter className="p-4 border-t border-gray-700">
              <Button variant="outline" onClick={() => handleAddSet(exercise.id)} className="w-full border-gray-600 text-gray-300 hover:bg-purple-900/50 hover:border-purple-500 hover:text-white transition-all duration-200">
                <PlusCircle size={18} className="mr-2 text-purple-400" /> Add Set
              </Button>
            </CardFooter>
          </Card>
        ))}
      </main>

      {/* Sticky Footer - Placeholder for timer/plate calculator */}
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 p-3 flex justify-around items-center shadow-[0_-4px_10px_rgba(0,0,0,0.25)] z-10">
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-purple-800/50 transition-colors duration-200">
          <Timer size={18} className="mr-2 text-purple-400" /> Rest Timer
        </Button>
        {/* Spacer or more buttons */}
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-blue-800/50 transition-colors duration-200">
          <Calculator size={18} className="mr-2 text-blue-400" /> Plate Calculator
        </Button>
      </footer>
      </div>
    </div>
  );
};

export default ActiveWorkoutPage;
