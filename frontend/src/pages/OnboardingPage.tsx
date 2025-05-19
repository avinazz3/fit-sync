import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useOnboardingStore } from "../utils/onboardingStore"; // Adjusted import path
import { FitnessGoalSelection } from "../components/FitnessGoalSelection"; // Added import
import { InjurySelection } from "../components/InjurySelection"; // Added import
import { WorkoutPreferencesSelection } from "../components/WorkoutPreferencesSelection"; // Added import
import { EquipmentSelection } from "../components/EquipmentSelection"; // Added import

// Placeholder components for each step - these will be fleshed out or replaced

export default function OnboardingPage() {
  const navigate = useNavigate();
  const {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    isCompleted,
    injuries, // get current injuries
    setInjuries, // to set injuries from "other" field
    // Add functions to set data here later, e.g., setFitnessGoal
  } = useOnboardingStore();

  const [otherInjuryText, setOtherInjuryText] = React.useState(""); // Local state for the other injury text input field

  const progressValue = (currentStep / (totalSteps +1 )) * 100;

  const handleNext = () => {
    if (currentStep === 2) {
      // Commit "other" injury text before proceeding from step 2
      const trimmedOther = otherInjuryText.trim();
      if (trimmedOther !== "" && !injuries.includes(trimmedOther)) {
        setInjuries([...injuries, trimmedOther]);
      }
    }
    if (currentStep <= totalSteps) {
      nextStep();
    } else {
      // Onboarding complete, navigate to DashboardPage
      navigate("/dashboard-page"); 
    }
  };

  const handlePrev = () => {
    prevStep();
  };

  if (isCompleted()) {
    // This case is handled by the navigate in handleNext when currentStep > totalSteps
    // but as a fallback or if directly navigated here when completed:
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-primary">Onboarding Complete!</h1>
        <p className="text-muted-foreground mb-8">Thank you for setting up your preferences.</p>
        <Button onClick={() => navigate("/dashboard-page")}>Go to Dashboard</Button>
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <FitnessGoalSelection />;
      case 2:
        // Pass down otherInjuryText and a way to set it
        return <InjurySelection otherInjuryText={otherInjuryText} setOtherInjuryText={setOtherInjuryText} />;
      case 3:
        return <WorkoutPreferencesSelection />;
      case 4:
        return <EquipmentSelection />;
      default:
        // This case should ideally not be reached if currentStep is managed correctly
        // Or it's the step after the last one, signifying completion before redirection
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-semibold mb-4">Finalizing...</h2>
            <p>Please wait while we save your preferences.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 md:p-8">
      <div className="w-full max-w-xl bg-card shadow-soft rounded-xl p-6 md:p-10">
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Welcome to Wellnash!</h1>
        <p className="text-muted-foreground text-center mb-8">Let's personalize your fitness journey.</p>
        
        <div className="mb-8">
          <Progress value={progressValue} className="w-full" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Step {Math.min(currentStep, totalSteps)} of {totalSteps}
          </p>
        </div>

        <div className="min-h-[200px]">
          {renderStepContent()}
        </div>

        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 1} className="rounded-full">
            Previous
          </Button>
          <Button onClick={handleNext} className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {currentStep <= totalSteps ? "Next" : "View Dashboard"}
          </Button>
        </div>
      </div>
    </div>
  );
}
