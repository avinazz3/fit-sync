import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { ChevronRight, ChevronLeft, Clock, Sparkles } from "lucide-react";

interface DurationOption {
  id: string;
  value: string; // e.g., "30"
  label: string; // e.g., "30 minutes"
  description?: string;
}

const durationOptions: DurationOption[] = [
  { id: "dur_30", value: "30", label: "30 minutes", description: "Quick & effective session" },
  { id: "dur_45", value: "45", label: "45 minutes", description: "Standard focused workout" },
  { id: "dur_60", value: "60", label: "60 minutes", description: "Full comprehensive session" },
  { id: "dur_75", value: "75", label: "75 minutes", description: "Extended workout for more volume" },
  { id: "dur_90", value: "90", label: "90 minutes", description: "Intense, longer duration training" },
];

const SelectDurationPage = () => {
  const navigate = useNavigate();
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(undefined);
  const [selectedGymId, setSelectedGymId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve the selected gym from the previous step
    const gymId = localStorage.getItem("selectedGymId");
    if (gymId) {
      setSelectedGymId(gymId);
    } else {
      // If no gym is selected, perhaps redirect back or show an error
      toast.error("No gym location selected. Please go back.");
      // navigate("/select-gym-page"); // Optional: redirect
    }
  }, [navigate]);

  const handleNext = () => {
    if (!selectedDuration) {
      toast.error("Please select a workout duration.");
      return;
    }
    if (!selectedGymId) {
        toast.error("Gym selection is missing. Please go back and select a gym.");
        return;
    }
    console.log("Selected Gym ID:", selectedGymId, "Selected Duration:", selectedDuration);
    // For MVP, store selection in local storage
    localStorage.setItem("selectedDuration", selectedDuration);
    
    // Navigate to the Generating Workout Screen
    navigate("/generating-workout-page"); // Assuming this route will be created
    toast.success(`Duration selected: ${durationOptions.find(d => d.value === selectedDuration)?.label}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-lg bg-gray-800/70 backdrop-blur-md border-gray-700 shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center p-6 sm:p-8 border-b border-gray-700">
          <Clock className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <CardTitle className="text-3xl font-bold text-white">How Long Will You Train?</CardTitle>
          <CardDescription className="text-gray-300 mt-2 text-base">
            Choose the duration for your workout session.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          {selectedGymId ? (
            <RadioGroup value={selectedDuration} onValueChange={setSelectedDuration} className="space-y-3">
              {durationOptions.map((duration) => (
                <Label 
                  key={duration.id} 
                  htmlFor={duration.id} 
                  className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out 
                              ${selectedDuration === duration.value 
                                ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
                                : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'}`}
                >
                  <RadioGroupItem value={duration.value} id={duration.id} className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-purple-600 data-[state=checked]:border-purple-300" />
                  <div className="flex-grow">
                    <span className={`font-semibold text-base ${selectedDuration === duration.value ? 'text-white' : 'text-gray-100'}`}>{duration.label}</span>
                    {duration.description && <p className={`text-xs ${selectedDuration === duration.value ? 'text-purple-100' : 'text-gray-400'}`}>{duration.description}</p>}
                  </div>
                </Label>
              ))}
            </RadioGroup>
          ) : (
            <p className="text-center text-yellow-400 py-4">Gym selection not found. Please return to the previous step.</p>
          )}
        </CardContent>

        <CardFooter className="p-6 sm:p-8 bg-gray-800/50 border-t border-gray-700 flex items-center justify-between">
          <Button 
            variant="outline"
            onClick={() => navigate("/select-gym-page")} 
            className="h-12 text-base font-semibold border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg shadow-md transition-all duration-300 ease-in-out flex items-center group"
          >
            <ChevronLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </Button>
          <Button 
            onClick={handleNext} 
            disabled={!selectedDuration || !selectedGymId}
            className="h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center group"
          >
            Next <Sparkles className="w-5 h-5 ml-1.5 mr-0.5 group-hover:scale-125 transition-transform"/> <ChevronRight className="w-5 h-5 ml-0.5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SelectDurationPage;
