import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOnboardingStore } from "../utils/onboardingStore";

const commonEquipment = [
  { id: "dumbbells", label: "Dumbbells" },
  { id: "barbell", label: "Barbell & Plates" },
  { id: "kettlebells", label: "Kettlebells" },
  { id: "resistance_bands", label: "Resistance Bands" },
  { id: "pull_up_bar", label: "Pull-up Bar" },
  { id: "bench", label: "Adjustable Bench" },
  { id: "cable_machine", label: "Cable Machine" },
  { id: "leg_press", label: "Leg Press Machine" },
  { id: "treadmill", label: "Treadmill" },
  { id: "stationary_bike", label: "Stationary Bike" },
  { id: "rowing_machine", label: "Rowing Machine" },
  { id: "none", label: "None / Bodyweight only" },
];

interface Props {}

export const EquipmentSelection: React.FC<Props> = () => {
  const { availableEquipment, setAvailableEquipment } = useOnboardingStore();

  const handleCheckboxChange = (equipmentId: string, checked: boolean | "indeterminate") => {
    let updatedEquipment = [...(availableEquipment || [])]; // Safeguard with default empty array
    if (checked === true) {
      if (equipmentId === "none") {
        // If "None" is selected, clear other selections and select only "None"
        updatedEquipment = ["none"];
      } else {
        // If other equipment is selected, ensure "None" is not selected
        // and add the current selection
        updatedEquipment = updatedEquipment.filter(e => e !== "none");
        if (!updatedEquipment.includes(equipmentId)) {
          updatedEquipment.push(equipmentId);
        }
      }
    } else {
      // If unchecking, simply remove it
      updatedEquipment = updatedEquipment.filter((e) => e !== equipmentId);
    }
    setAvailableEquipment(updatedEquipment);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-foreground">
        Gym Equipment Availability
      </h2>
      <p className="text-muted-foreground text-center mb-8">
        Select the equipment you have access to. This helps us create effective workouts.
      </p>
      <Card className="shadow-soft rounded-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center text-primary">Available Equipment</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {commonEquipment.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={item.id}
                  checked={(availableEquipment || []).includes(item.id)} // Safeguard here too
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked)}
                  className="form-checkbox h-5 w-5 text-primary border-primary focus:ring-primary"
                />
                <Label htmlFor={item.id} className="text-sm md:text-base font-medium text-foreground cursor-pointer flex-grow">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Navigation button will be in OnboardingPage.tsx */}
    </div>
  );
};