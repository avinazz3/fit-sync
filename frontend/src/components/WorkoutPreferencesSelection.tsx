import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useOnboardingStore } from "../utils/onboardingStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {}

export const WorkoutPreferencesSelection: React.FC<Props> = () => {
  const {
    workoutDuration,
    setWorkoutDuration,
    workoutFrequency,
    setWorkoutFrequency,
  } = useOnboardingStore();

  const durationOptions = [30, 45, 60, 75, 90]; // minutes
  const frequencyOptions = [1, 2, 3, 4, 5, 6, 7]; // days per week

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-foreground">
        Workout Preferences
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        How long and how often do you prefer to work out?
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-soft rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center text-primary">Preferred Duration</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="mb-4 text-center">
              <span className="text-3xl font-bold text-foreground">
                {workoutDuration || durationOptions[1]} {/* Default to 45 if null */}
              </span>
              <span className="text-sm text-muted-foreground ml-1">minutes</span>
            </div>
            <Slider
              defaultValue={[workoutDuration || durationOptions[1]]}
              min={durationOptions[0]}
              max={durationOptions[durationOptions.length - 1]}
              step={15} // Steps of 15 minutes
              onValueChange={(value) => setWorkoutDuration(value[0])}
              className="[&>span:first-child]:h-1 [&>span:first-child]:bg-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>{durationOptions[0]} min</span>
              <span>{durationOptions[durationOptions.length - 1]} min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl text-center text-primary">Workouts Per Week</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <RadioGroup
              defaultValue={workoutFrequency?.toString() || frequencyOptions[2].toString()} // Default to 3 days if null
              onValueChange={(value) => setWorkoutFrequency(parseInt(value))}
              className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-3"
            >
              {frequencyOptions.map((freq) => (
                <div key={freq} className="flex flex-col items-center space-y-1">
                  <RadioGroupItem 
                    value={freq.toString()} 
                    id={`freq-${freq}`} 
                    className="sr-only peer" 
                  />
                  <Label
                    htmlFor={`freq-${freq}`}
                    className={`flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-3 md:p-4 text-sm md:text-base
                               hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary
                               transition-colors cursor-pointer w-full`}
                  >
                    {freq} day{freq > 1 ? 's' : ''}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
       {/* Navigation button will be in OnboardingPage.tsx */}
    </div>
  );
};
