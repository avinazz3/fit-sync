import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Added Textarea
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Toaster, toast } from "sonner";
import { ArrowLeft, CheckCircle, Info, Dumbbell, Flame, Sparkles, Trophy } from "lucide-react";
import { saveWorkoutToHistory, LoggedWorkout, LoggedExercise, LoggedExerciseSet } from "../utils/workoutManager"; // Added import

// Types (can be moved to a types file later)
interface ExerciseSet { // This type is used for the component's internal state
  id: string;
  reps: number | string; 
  weight?: number; 
  completed: boolean;
}

interface Exercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  targetReps: string; // e.g., "3 sets of 10-12 reps"
  instructions?: string;
  muscleGroups?: string[];
  imageUrl?: string; // Placeholder for exercise image
  exerciseNotes?: string; // Added for exercise-specific notes
}

interface WorkoutPlan {
  id: string;
  name: string;
  // gymName?: string; // From localStorage
  // duration?: string; // From localStorage
  exercises: Exercise[];
}

// Mock data - this would be dynamically generated in a real scenario
const generateMockWorkout = (gymId?: string, duration?: string): WorkoutPlan => {
  // Simple logic to vary the workout slightly based on inputs
  let planName = "Your Personalized Workout";
  if (duration) planName += ` (${duration} mins)`;
  if (gymId?.includes("home")) planName += " - Home Edition";

  return {
    id: `workout_${Date.now()}`,
    name: planName,
    exercises: [
      {
        id: "ex1",
        name: "Barbell Squats",
        targetReps: "3 sets of 8-12 reps",
        sets: [
          { id: "s1", reps: "", weight: undefined, completed: false },
          { id: "s2", reps: "", weight: undefined, completed: false },
          { id: "s3", reps: "", weight: undefined, completed: false },
        ],
        instructions: "Keep your back straight, chest up, and go as low as comfortable. Ensure knees track over toes.",
        muscleGroups: ["Quads", "Glutes", "Hamstrings"],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Barbell+Squat",
      },
      {
        id: "ex2",
        name: "Bench Press",
        targetReps: "3 sets of 8-12 reps",
        sets: [
          { id: "s1", reps: "", weight: undefined, completed: false },
          { id: "s2", reps: "", weight: undefined, completed: false },
          { id: "s3", reps: "", weight: undefined, completed: false },
        ],
        instructions: "Lower the bar to your mid-chest and push explosively. Keep your shoulders retracted.",
        muscleGroups: ["Chest", "Triceps", "Shoulders"],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Bench+Press",
      },
      {
        id: "ex3",
        name: "Pull-ups (or Lat Pulldowns)",
        targetReps: "3 sets to failure (AMRAP)",
        sets: [
          { id: "s1", reps: "AMRAP", weight: undefined, completed: false },
          { id: "s2", reps: "AMRAP", weight: undefined, completed: false },
          { id: "s3", reps: "AMRAP", weight: undefined, completed: false },
        ],
        instructions: "Engage your lats, pull your chest towards the bar. Control the descent.",
        muscleGroups: ["Back", "Biceps"],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Pull-ups",
      },
      {
        id: "ex4",
        name: "Overhead Press",
        targetReps: "3 sets of 10-15 reps",
        sets: [
          { id: "s1", reps: "", weight: undefined, completed: false },
          { id: "s2", reps: "", weight: undefined, completed: false },
          { id: "s3", reps: "", weight: undefined, completed: false },
        ],
        instructions: "Press the bar overhead without arching your lower back excessively. Keep core tight.",
        muscleGroups: ["Shoulders", "Triceps"],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Overhead+Press",
      },
      {
        id: "ex5",
        name: "Plank",
        targetReps: "3 sets, 60s hold",
        sets: [
          { id: "s1", reps: "60s", weight: undefined, completed: false },
          { id: "s2", reps: "60s", weight: undefined, completed: false },
          { id: "s3", reps: "60s", weight: undefined, completed: false },
        ],
        instructions: "Maintain a straight line from head to heels. Engage your core and glutes.",
        muscleGroups: ["Core"],
        imageUrl: "https://via.placeholder.com/300x200.png?text=Plank",
      },
    ],
  };
};

const WorkoutDetailsPage = () => {
  const navigate = useNavigate();
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [overallWorkoutNotes, setOverallWorkoutNotes] = useState(""); // Added state for overall notes

  useEffect(() => {
    const gymId = localStorage.getItem("selectedGymId");
    const duration = localStorage.getItem("selectedDuration");
    
    // Generate mock workout based on retrieved selections (or use defaults)
    setWorkoutPlan(generateMockWorkout(gymId || undefined, duration || undefined));
    setStartTime(new Date()); // Record workout start time

    // Clear selections from localStorage as they are now "used" for this workout instance
    // localStorage.removeItem("selectedGymId");
    // localStorage.removeItem("selectedDuration"); // Or keep them if user might restart this flow often

  }, []);

  const handleSetChange = (exerciseId: string, setId: string, field: keyof ExerciseSet, value: any) => {
    setWorkoutPlan(prevPlan => {
      if (!prevPlan) return null;
      return {
        ...prevPlan,
        exercises: prevPlan.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return {
              ...ex,
              sets: ex.sets.map(set => {
                if (set.id === setId) {
                  return { ...set, [field]: value };
                }
                return set;
              })
            };
          }
          return ex;
        })
      };
    });
  };

  const handleExerciseNotesChange = (exerciseId: string, notes: string) => {
    setWorkoutPlan(prevPlan => {
      if (!prevPlan) return null;
      return {
        ...prevPlan,
        exercises: prevPlan.exercises.map(ex => {
          if (ex.id === exerciseId) {
            return { ...ex, exerciseNotes: notes };
          }
          return ex;
        })
      };
    });
  };

  const handleFinishWorkout = () => {
    if (!workoutPlan) return;

    const endTime = new Date();
    const durationMs = endTime.getTime() - (startTime?.getTime() || endTime.getTime());
    const durationMinutes = Math.round(durationMs / 60000);

    // Construct the workout data to save, matching LoggedWorkout structure
    const workoutToSave: LoggedWorkout = {
      id: workoutPlan.id,
      planName: workoutPlan.name,
      startTime: startTime ? startTime.toISOString() : new Date().toISOString(), // Ensure startTime is stored and in ISO format
      endTime: endTime.toISOString(),
      durationMinutes,
      exercises: workoutPlan.exercises.map(ex => ({
        id: ex.id,
        name: ex.name,
        targetReps: ex.targetReps,
        // Ensure the loggedSets match the LoggedExerciseSet structure from workoutManager
        loggedSets: ex.sets.map(s => ({
          id: s.id,
          reps: s.reps, // Already number | string, which is fine
          weight: s.weight,
          completed: s.completed,
        })),
        notes: ex.exerciseNotes, // Save exercise-specific notes
      })),
      overallNotes: overallWorkoutNotes, // Save overall workout notes
    };

    saveWorkoutToHistory(workoutToSave); // Use the new manager function

    toast.success("Workout Finished & Saved to History! Well done!", {
      icon: <Trophy className="text-yellow-400" />,
      duration: 4000,
    });
    // Navigate to a summary/home page
    navigate("/"); // Go to Home Screen as per guide (index 0)
  };

  if (!workoutPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg border-gray-700 shadow-2xl rounded-xl text-center p-8">
          <Flame className="w-12 h-12 mx-auto mb-4 text-orange-400 animate-pulse" />
          <h2 className="text-2xl font-semibold mb-2">Loading Workout...</h2>
          <p className="text-gray-400">Preparing your session.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white p-4 sm:p-6 pb-24">
      <Toaster richColors position="top-center" />
      <header className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate("/generating-workout-page")} className="text-gray-300 hover:text-white hover:bg-gray-700/50">
          <ArrowLeft size={20} className="mr-2" /> Back to Loading
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-center text-purple-300 truncate flex-grow"> {workoutPlan.name} </h1>
        <div className="w-20">{/* Spacer */}</div>
      </header>

      <Accordion type="multiple" defaultValue={workoutPlan.exercises.map(ex => ex.id)} className="space-y-4">
        {workoutPlan.exercises.map((exercise, exIndex) => (
          <Card key={exercise.id} className="bg-gray-800/60 backdrop-blur-md border-gray-700 shadow-lg rounded-xl overflow-hidden">
            <AccordionItem value={exercise.id} className="border-b-0">
              <AccordionTrigger className="p-4 hover:bg-gray-700/50 transition-colors rounded-t-xl">
                <div className="flex items-center space-x-3 w-full">
                  <Dumbbell className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="flex-grow text-left">
                    <h3 className="text-lg font-semibold text-white">{exIndex + 1}. {exercise.name}</h3>
                    <p className="text-xs text-gray-400">{exercise.targetReps}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4 pt-2 bg-gray-800/30 rounded-b-xl">
                {exercise.imageUrl && 
                  <img src={exercise.imageUrl} alt={exercise.name} className="rounded-md mb-3 h-32 w-full object-cover" />
                }
                {exercise.instructions && (
                  <p className="text-xs text-gray-300 mb-3 p-2 bg-gray-700/40 rounded-md">
                    <Info size={14} className="inline mr-1.5 relative -top-px text-blue-400" /> {exercise.instructions}
                  </p>
                )}
                {exercise.muscleGroups && exercise.muscleGroups.length > 0 && (
                    <p className="text-xs text-gray-400 mb-4">Targets: {exercise.muscleGroups.join(", ")}</p>
                )}
                
                <div className="space-y-3">
                  {exercise.sets.map((set, setIndex) => (
                    <div key={set.id} className="flex items-center space-x-2 p-2 bg-gray-700/30 rounded-md">
                      <Label htmlFor={`set-${exercise.id}-${set.id}-completed`} className="flex items-center space-x-2 cursor-pointer flex-shrink-0">
                        <Checkbox 
                          id={`set-${exercise.id}-${set.id}-completed`}
                          checked={set.completed}
                          onCheckedChange={(checked) => handleSetChange(exercise.id, set.id, 'completed', checked)}
                          className="border-gray-500 data-[state=checked]:bg-purple-500 data-[state=checked]:text-white data-[state=checked]:border-purple-400"
                        />
                        <span className={`text-sm font-medium ${set.completed ? 'text-purple-300 line-through' : 'text-gray-200'}`}>Set {setIndex + 1}</span>
                      </Label>
                      
                      {set.reps !== "AMRAP" && set.reps !== "60s" && /* Simple check to not show reps/weight for AMRAP/timed sets */ (
                        <>
                         <Input 
                            type="number"
                            placeholder="Reps"
                            value={set.reps}
                            onChange={(e) => handleSetChange(exercise.id, set.id, 'reps', e.target.value ? parseInt(e.target.value) : '')}
                            className="w-20 h-8 bg-gray-600 border-gray-500 text-white text-sm focus:ring-purple-500 focus:border-purple-500 rounded-md"
                            disabled={set.completed}
                          />
                          <Input 
                            type="number"
                            placeholder="kg"
                            value={set.weight === undefined ? '' : set.weight}
                            onChange={(e) => handleSetChange(exercise.id, set.id, 'weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                            className="w-20 h-8 bg-gray-600 border-gray-500 text-white text-sm focus:ring-purple-500 focus:border-purple-500 rounded-md"
                            disabled={set.completed}
                          />
                        </>
                      )}
                      {(set.reps === "AMRAP" || set.reps === "60s") && (
                         <span className="text-sm text-gray-400 ml-auto pr-2">({set.reps})</span>
                      )}

                    </div>
                  ))}
                </div>
                {/* Exercise Notes Textarea */}
                <div className="mt-4">
                  <Label htmlFor={`exercise-notes-${exercise.id}`} className="text-sm font-medium text-gray-300 mb-1 block">Exercise Notes</Label>
                  <Textarea
                    id={`exercise-notes-${exercise.id}`}
                    placeholder={`Any notes for ${exercise.name}? (e.g., felt strong, form check needed)`}
                    value={exercise.exerciseNotes || ""}
                    onChange={(e) => handleExerciseNotesChange(exercise.id, e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500 rounded-md min-h-[60px] text-sm"
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        ))}
      </Accordion>

      {/* Overall Workout Notes Textarea */}
      <Card className="my-6 bg-gray-800/60 backdrop-blur-md border-gray-700 shadow-lg rounded-xl">
        <CardHeader>
          <CardTitle className="text-lg text-purple-300">Overall Workout Notes</CardTitle>
          <CardDescription className="text-gray-400 text-xs">How did the session feel overall? Any general observations?</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="e.g., Felt energetic, gym was crowded, focused on form..."
            value={overallWorkoutNotes}
            onChange={(e) => setOverallWorkoutNotes(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white focus:ring-purple-500 focus:border-purple-500 rounded-md min-h-[80px] text-sm"
          />
        </CardContent>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-md border-t border-gray-700 shadow-top-lg">
        <Button 
          onClick={handleFinishWorkout}
          className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center group"
          disabled={!workoutPlan || workoutPlan.exercises.every(ex => ex.sets.every(s => s.completed)) === false && !workoutPlan.exercises.some(ex => ex.sets.some(s => s.completed))}
        >
          <CheckCircle size={24} className="mr-2.5 group-hover:scale-110 transition-transform" /> Finish Workout & Save
        </Button>
      </div>
    </div>
  );
};

export default WorkoutDetailsPage;
