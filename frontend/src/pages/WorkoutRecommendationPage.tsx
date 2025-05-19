import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Input } from "@/components/ui/input"; // Not used after removing focus/injury text input
import { Label } from "@/components/ui/label";
// import { Checkbox } from "@/components/ui/checkbox"; // Not used after removing injury checkboxes
import { Toaster, toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Replace, Info } from 'lucide-react';

// Placeholder types
interface RecommendedExercise {
  id: string;
  name: string;
  imageUrl?: string;
  setsReps: string;
  description: string;
  muscleGroups: string[];
  alternatives?: RecommendedExercise[];
}

interface MockWorkoutPlan {
  id: string;
  name: string;
  exercises: RecommendedExercise[];
}

const WorkoutRecommendationPage = () => {
  const navigate = useNavigate();

  const [duration, setDuration] = useState<string>("");
  // Removed focusArea state
  // Removed injuries state
  // Removed otherInjury state

  const [recommendedPlan, setRecommendedPlan] = useState<MockWorkoutPlan | null>(null);

  const handleGenerateWorkout = () => {
    if (!duration) {
      toast.error("Please select a workout duration.");
      return;
    }

    console.log("Generating workout with:", { duration });
    // Mock plan generation without focus area or injuries for this simplified page
    const mockPlan: MockWorkoutPlan = {
        id: "plan1",
        name: `Your Personalized Workout for ${duration} minutes`,
        exercises: [
            { id: "ex1", name: "Mock Exercise 1 (e.g., Squats)", setsReps: "3 sets of 10-12 reps", description: "A great lower body exercise.", muscleGroups: ["Quads", "Glutes"], alternatives: [] },
            { id: "ex2", name: "Mock Exercise 2 (e.g., Push-ups)", setsReps: "3 sets, AMRAP", description: "Builds upper body strength.", muscleGroups: ["Chest", "Triceps"], alternatives: [] },
            { id: "ex3", name: "Mock Exercise 3 (e.g., Plank)", setsReps: "3 sets, 60s hold", description: "Core stability exercise.", muscleGroups: ["Core"], alternatives: [] },
        ]
    };
    setRecommendedPlan(mockPlan);
    toast.success("Workout plan generated!");
  };

  const handleSwapExercise = (exerciseId: string) => {
    toast.info(`Swap functionality for ${exerciseId} to be implemented.`);
  };

  const handleShowDetails = (exercise: RecommendedExercise) => {
    toast.info(`Details for ${exercise.name} to be implemented via modal/sheet.`);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-background text-foreground min-h-screen">
      <Toaster richColors position="top-center" />
      <Card className="max-w-4xl mx-auto shadow-xl rounded-lg mb-10">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold flex items-center justify-center">
            <Sparkles className="w-8 h-8 mr-3 text-purple-500" /> Smart Workout Recommendations
          </CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Tell us your preferences, and we'll craft a workout for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8 p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <Label htmlFor="duration" className="text-base font-medium mb-2 block">Workout Duration (minutes)</Label>
                <Select onValueChange={setDuration} value={duration}>
                    <SelectTrigger id="duration" className="w-full text-base py-3">
                        <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="45">45 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="75">75 minutes</SelectItem>
                        <SelectItem value="90">90 minutes</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {/* Focus Area and Injury sections have been removed */}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center p-6">
          <Button onClick={handleGenerateWorkout} size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-0.5">
            Generate My Workout <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardFooter>
      </Card>

      {recommendedPlan && (
        <Card className="max-w-4xl mx-auto shadow-xl rounded-lg mt-10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Your Custom Workout Plan</CardTitle>
            <CardDescription>{recommendedPlan.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedPlan.exercises.map((exercise) => (
              <Card key={exercise.id} className="p-4 bg-muted/30 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold text-primary">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground">{exercise.setsReps}</p>
                  <p className="text-xs text-muted-foreground mt-1">Muscles: {exercise.muscleGroups.join(", ")}</p>
                </div>
                <div className="flex space-x-2 flex-shrink-0 mt-2 sm:mt-0">
                  <Button variant="outline" size="sm" onClick={() => handleShowDetails(exercise)} className="text-sm">
                    <Info size={16} className="mr-1.5" /> Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleSwapExercise(exercise.id)} className="text-sm">
                    <Replace size={16} className="mr-1.5" /> Swap
                  </Button>
                </div>
              </Card>
            ))}
          </CardContent>
           <CardFooter className="flex justify-end p-4">
            <Button onClick={() => {/* Logic to start this workout -> navigate to ActiveWorkoutPage with this plan */ toast.info('Starting workout... (to be implemented)')}} className="bg-green-600 hover:bg-green-700 text-white">
                Start This Workout
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default WorkoutRecommendationPage;
