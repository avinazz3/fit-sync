import React, { useState, useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboardingStore } from "../utils/onboardingStore";

const allInjuries = [
  { id: "ankle_sprain", label: "Ankle Sprain" },
  { id: "achilles_tendinitis", label: "Achilles Tendinitis" },
  { id: "runners_knee", label: "Runner's Knee (Patellofemoral Pain)" },
  { id: "acl_tear", label: "ACL Tear/Strain" },
  { id: "meniscus_tear", label: "Meniscus Tear" },
  { id: "shin_splints", label: "Shin Splints" },
  { id: "hamstring_strain", label: "Hamstring Strain" },
  { id: "quad_strain", label: "Quadriceps Strain" },
  { id: "groin_pull", label: "Groin Pull (Adductor Strain)" },
  { id: "hip_flexor_strain", label: "Hip Flexor Strain" },
  { id: "lower_back_pain", label: "Lower Back Pain/Strain" },
  { id: "shoulder_impingement", label: "Shoulder Impingement" },
  { id: "rotator_cuff_tear", label: "Rotator Cuff Tear/Tendinopathy" },
  { id: "shoulder_dislocation", label: "Shoulder Dislocation/Instability" },
  { id: "tennis_elbow", label: "Tennis Elbow (Lateral Epicondylitis)" },
  { id: "golfers_elbow", label: "Golfer's Elbow (Medial Epicondylitis)" },
  { id: "wrist_sprain", label: "Wrist Sprain/Tendinopathy" },
  { id: "pectoral_strain", label: "Pectoral Strain" },
  { id: "it_band_syndrome", label: "IT Band Syndrome" },
  { id: "plantar_fasciitis", label: "Plantar Fasciitis" },
];

interface Props {
  otherInjuryText: string;
  setOtherInjuryText: (text: string) => void;
}

export const InjurySelection: React.FC<Props> = ({ otherInjuryText, setOtherInjuryText }) => {
  const { injuries, setInjuries } = useOnboardingStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredInjuries = useMemo(() => {
    return allInjuries.filter(injury => 
      injury.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCheckboxChange = (injuryId: string, checked: boolean | "indeterminate") => {
    let updatedInjuries = [...injuries];
    // If checking an injury, remove "none" if it's selected
    if (checked === true && injuryId !== "none") {
      updatedInjuries = updatedInjuries.filter(i => i !== "none");
    }
    // If checking "none", clear all other injuries
    if (checked === true && injuryId === "none") {
      updatedInjuries = ["none"];
    } else if (checked === true) {
      if (!updatedInjuries.includes(injuryId)) {
        updatedInjuries.push(injuryId);
      }
    } else {
      updatedInjuries = updatedInjuries.filter((i) => i !== injuryId);
    }
    setInjuries(updatedInjuries);
  };

  const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtherInjuryText(e.target.value);
     // If user types in "other" field, uncheck "none" if it was selected
    if (injuries.includes("none")) {
      setInjuries(injuries.filter(i => i !== "none"));
    }
  };
  
  const allInjuriesWithNone = useMemo(() => [
    ...allInjuries,
    { id: "none", label: "None / No current injuries" }
  ], []);

  const injuriesToDisplay = useMemo(() => {
    return allInjuriesWithNone.filter(injury => 
      injury.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allInjuriesWithNone]);


  return (
    <div className="w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-2 text-foreground">Any Injuries or Limitations?</h2>
      <p className="text-muted-foreground text-center mb-6">
        Select any current issues, or search if you don't see yours listed. This helps us tailor workouts safely.
      </p>
      
      <Input 
        type="search"
        placeholder="Search injuries (e.g., Runner's Knee)..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6 focus:border-primary focus:ring-primary"
      />

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-muted-foreground/50 scrollbar-track-transparent">
        {injuriesToDisplay.length > 0 ? (
          injuriesToDisplay.map((injury) => (
            <div key={injury.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <Checkbox
                id={injury.id}
                checked={injuries.includes(injury.id)}
                onCheckedChange={(checked) => handleCheckboxChange(injury.id, checked)}
                className="form-checkbox h-5 w-5 text-primary border-primary focus:ring-primary shrink-0"
                disabled={injury.id !== "none" && injuries.includes("none") && !injuries.includes(injury.id)} // Disable other checkboxes if "none" is checked
              />
              <Label 
                htmlFor={injury.id} 
                className={`text-base font-medium text-foreground cursor-pointer flex-grow ${(injury.id !== "none" && injuries.includes("none")) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {injury.label}
              </Label>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-center py-4">No injuries match your search. You can specify below.</p>
        )}
      </div>
      
      <div className="space-y-2 border-t border-border pt-6">
        <Label htmlFor="other-injury" className="text-base font-medium text-foreground">Other (please specify if not listed or searched):</Label>
        <Input 
          id="other-injury" 
          type="text" 
          placeholder="e.g., Recent muscle pull not listed"
          value={otherInjuryText}
          onChange={handleOtherInputChange}
          className="focus:border-primary focus:ring-primary"
          disabled={injuries.includes("none")} // Disable if "none" is selected
        />
      </div>
    </div>
  );
};