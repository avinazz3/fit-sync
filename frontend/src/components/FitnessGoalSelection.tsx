import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingStore } from "../utils/onboardingStore"; // Adjusted import path relative to components/
import { Dumbbell, TrendingUp, Zap, Heart } from "lucide-react";

const goals = [
  { id: "strength", name: "Build Strength", description: "Focus on lifting heavier and building muscle mass.", icon: <Dumbbell className="w-8 h-8 mb-3 text-primary" /> },
  { id: "weight_loss", name: "Weight Loss", description: "Prioritize calorie burning and metabolic conditioning.", icon: <TrendingUp className="w-8 h-8 mb-3 text-primary" /> },
  { id: "endurance", name: "Improve Endurance", description: "Enhance cardiovascular fitness and stamina.", icon: <Zap className="w-8 h-8 mb-3 text-primary" /> },
  { id: "general_fitness", name: "General Fitness", description: "Maintain overall health and well-being.", icon: <Heart className="w-8 h-8 mb-3 text-primary" /> },
];

interface Props {
  // No onNext prop needed here, as the main OnboardingPage handles navigation
}

export const FitnessGoalSelection: React.FC<Props> = () => {
  const { fitnessGoal, setFitnessGoal } = useOnboardingStore();

  const handleSelectGoal = (goalId: string) => {
    setFitnessGoal(goalId);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-foreground">What's Your Primary Fitness Goal?</h2>
      <p className="text-muted-foreground text-center mb-8">Select the goal that best describes what you want to achieve.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all duration-200 ease-in-out hover:shadow-soft-lg hover:border-primary/80
              ${fitnessGoal === goal.id ? "border-primary ring-2 ring-primary shadow-soft-lg" : "border-border"}`}
            onClick={() => handleSelectGoal(goal.id)}
          >
            <CardHeader className="items-center pb-2">
              {goal.icon}
              <CardTitle className="text-lg text-center">{goal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground text-center">{goal.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Navigation button will be in OnboardingPage.tsx */}
    </div>
  );
};
