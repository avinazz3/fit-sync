import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BrainCircuit } from 'lucide-react'; // Using BrainCircuit for AI/generation theme

const GeneratingWorkoutScreen = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(10);
  const [loadingMessage, setLoadingMessage] = useState("Initializing workout parameters...");

  useEffect(() => {
    const selectedGymId = localStorage.getItem("selectedGymId");
    const selectedDuration = localStorage.getItem("selectedDuration");

    // You can use these values if you want to show them or pass them on
    console.log("Generating workout for Gym:", selectedGymId, "Duration:", selectedDuration);

    // Simulate loading and then navigate
    const messages = [
      "Analyzing your preferences...",
      "Selecting optimal exercises...",
      "Considering equipment availability (mocked)...",
      "Balancing muscle groups...",
      "Crafting your personalized plan...",
      "Almost there!",
    ];
    let messageIndex = 0;

    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        const newProgress = prevProgress + Math.random() * 10;
        return Math.min(newProgress, 100);
      });
      setLoadingMessage(messages[messageIndex % messages.length]);
      messageIndex++;
    }, 700); // Update message and progress more frequently

    const navigationTimeout = setTimeout(() => {
      clearInterval(timer);
      setProgress(100);
      setLoadingMessage("Workout generated successfully!");
      // For MVP, navigate to a placeholder Workout Details page
      // This will later be WorkoutDetailsPage.tsx from the guide
      // We'll use a generic name for now and rename/refactor later if needed
      navigate("/workout-details-page"); 
    }, 5000); // Total time for loading simulation

    return () => {
      clearInterval(timer);
      clearTimeout(navigationTimeout);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md bg-gray-800/80 backdrop-blur-lg border-gray-700 shadow-2xl rounded-xl overflow-hidden text-center">
        <CardHeader className="p-6 sm:p-8">
          <BrainCircuit className="w-16 h-16 mx-auto mb-6 text-purple-400 animate-pulse" />
          <CardTitle className="text-3xl font-bold text-white">Generating Your Workout</CardTitle>
          <CardDescription className="text-gray-300 mt-3 text-base">
            Please wait while our AI crafts the perfect session for you based on your selections.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 space-y-5">
          <Progress value={progress} className="w-full h-3 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-indigo-500" />
          <p className="text-sm text-purple-300 animate-pulse min-h-[20px]">{loadingMessage}</p>
        </CardContent>
      </Card>
      <p className="mt-8 text-xs text-gray-500">FitSync - Your Personalized Fitness Partner</p>
    </div>
  );
};

export default GeneratingWorkoutScreen;
