import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toaster, toast } from "sonner";
import { ChevronRight, Home, Search, Building2 } from "lucide-react";

interface MockGym {
  id: string;
  name: string;
  description?: string;
  icon?: React.ElementType;
}

const mockGyms: MockGym[] = [
  { id: "gym_fitlife", name: "FitLife Center", description: "Fully equipped, modern facility", icon: Building2 },
  { id: "gym_iron_paradise", name: "Iron Paradise", description: "Heavy lifting, bodybuilding focus", icon: Building2 },
  { id: "gym_community_rec", name: "Community Rec Center", description: "Versatile, family-friendly", icon: Building2 },
  { id: "home_workout", name: "Home Workout", description: "Using available equipment at home", icon: Home },
];

const SelectGymPage = () => {
  const navigate = useNavigate();
  const [selectedGymId, setSelectedGymId] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleNext = () => {
    if (!selectedGymId) {
      toast.error("Please select a gym or workout location.");
      return;
    }
    console.log("Selected Gym ID:", selectedGymId);
    // For MVP, store selection in local storage or pass via state if simple enough
    // In a real app, this state might be managed globally or passed to the next route
    localStorage.setItem("selectedGymId", selectedGymId);
    // Navigate to the next step in the workout flow, e.g., Select Duration Screen
    navigate("/select-duration-page"); // Assuming this route will be created
    toast.success(`Location selected: ${mockGyms.find(g => g.id === selectedGymId)?.name}`);
  };

  const filteredGyms = mockGyms.filter(gym => 
    gym.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    gym.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-900 text-white flex flex-col items-center justify-center p-4 sm:p-6">
      <Toaster richColors position="top-center" />
      <Card className="w-full max-w-lg bg-gray-800/70 backdrop-blur-md border-gray-700 shadow-2xl rounded-xl overflow-hidden">
        <CardHeader className="text-center p-6 sm:p-8 border-b border-gray-700">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-purple-400" />
          <CardTitle className="text-3xl font-bold text-white">Where Are You Working Out?</CardTitle>
          <CardDescription className="text-gray-300 mt-2 text-base">
            Select your gym or workout location to help us tailor your plan.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 sm:p-8 space-y-6">
          <div className="relative">
            <Input 
              type="search"
              placeholder="Search for a gym... (mock)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white placeholder-gray-400 rounded-lg h-12 pl-10 pr-4 text-base focus:ring-purple-500 focus:border-purple-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {filteredGyms.length > 0 ? (
            <RadioGroup value={selectedGymId} onValueChange={setSelectedGymId} className="space-y-3">
              {filteredGyms.map((gym) => {
                const IconComponent = gym.icon || Building2; // Default icon
                return (
                  <Label 
                    key={gym.id} 
                    htmlFor={gym.id} 
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-all duration-200 ease-in-out 
                                ${selectedGymId === gym.id 
                                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
                                  : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700 hover:border-gray-500'}`}
                  >
                    <RadioGroupItem value={gym.id} id={gym.id} className="border-gray-500 data-[state=checked]:bg-white data-[state=checked]:text-purple-600 data-[state=checked]:border-purple-300" />
                    <IconComponent className={`w-6 h-6 ${selectedGymId === gym.id ? 'text-white' : 'text-purple-400'}`} />
                    <div className="flex-grow">
                      <span className={`font-semibold text-base ${selectedGymId === gym.id ? 'text-white' : 'text-gray-100'}`}>{gym.name}</span>
                      {gym.description && <p className={`text-xs ${selectedGymId === gym.id ? 'text-purple-100' : 'text-gray-400'}`}>{gym.description}</p>}
                    </div>
                  </Label>
                )
              })}
            </RadioGroup>
          ) : (
            <p className="text-center text-gray-400 py-4">No gyms found matching your search.</p>
          )}
        </CardContent>

        <CardFooter className="p-6 sm:p-8 bg-gray-800/50 border-t border-gray-700">
          <Button 
            onClick={handleNext} 
            disabled={!selectedGymId}
            className="w-full h-12 text-base font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:-translate-y-0.5 flex items-center justify-center group"
          >
            Next <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SelectGymPage;
