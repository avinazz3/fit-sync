export interface Equipment {
  id: string;
  name: string;
  category: string; // e.g., Cardio, Strength, Functional
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Gym {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  rating: number; // Average rating
  reviews: Review[];
  equipment: Equipment[];
  operatingHours: {
    [key: string]: string; // e.g., Monday: "6:00 AM - 10:00 PM"
  };
  imageUrl?: string;
  phoneNumber?: string;
  website?: string;
  simulatedTravelTime: string; // e.g., "10-15 mins drive", "5 mins walk"
  amenities?: string[]; // e.g., "Parking", "Showers", "Sauna"
}

export const mockEquipment: Equipment[] = [
  { id: "eq1", name: "Treadmill", category: "Cardio" },
  { id: "eq2", name: "Elliptical Trainer", category: "Cardio" },
  { id: "eq3", name: "Stationary Bike", category: "Cardio" },
  { id: "eq4", name: "Rowing Machine", category: "Cardio" },
  { id: "eq5", name: "Dumbbells (Full Set)", category: "Strength" },
  { id: "eq6", name: "Barbells & Plates", category: "Strength" },
  { id: "eq7", name: "Bench Press Station", category: "Strength" },
  { id: "eq8", name: "Squat Rack", category: "Strength" },
  { id: "eq9", name: "Leg Press Machine", category: "Strength" },
  { id: "eq10", name: "Lat Pulldown Machine", category: "Strength" },
  { id: "eq11", name: "Cable Crossover Machine", category: "Strength" },
  { id: "eq12", name: "Kettlebells", category: "Functional" },
  { id: "eq13", name: "Yoga Mats", category: "Functional" },
  { id: "eq14", name: "Resistance Bands", category: "Functional" },
  { id: "eq15", name: "Pull-up Bar", category: "Strength" },
];

export const mockGyms: Gym[] = [
  {
    id: "gym1",
    name: "Peak Performance Center",
    address: "123 Fitness Ave, Wellness City, ST 12345",
    latitude: 34.0522,
    longitude: -118.2437, // Downtown LA approximation
    rating: 4.8,
    reviews: [
      { id: "r1", userName: "Alex P.", rating: 5, comment: "Amazing facility, great equipment!", date: "2024-05-01" },
      { id: "r2", userName: "Sarah K.", rating: 4, comment: "Clean and well-maintained, a bit crowded at peak hours.", date: "2024-04-15" },
    ],
    equipment: [mockEquipment[0], mockEquipment[1], mockEquipment[4], mockEquipment[5], mockEquipment[6], mockEquipment[7], mockEquipment[10], mockEquipment[11]],
    operatingHours: {
      Monday: "6:00 AM - 10:00 PM",
      Tuesday: "6:00 AM - 10:00 PM",
      Wednesday: "6:00 AM - 10:00 PM",
      Thursday: "6:00 AM - 10:00 PM",
      Friday: "6:00 AM - 9:00 PM",
      Saturday: "8:00 AM - 8:00 PM",
      Sunday: "8:00 AM - 6:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1576678927484-cc907957088c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    simulatedTravelTime: "10-15 mins drive",
    amenities: ["Parking", "Showers", "Juice Bar", "Group Classes"]
  },
  {
    id: "gym2",
    name: "Iron Paradise Gym",
    address: "456 Strength St, Muscle Town, ST 67890",
    latitude: 34.0722, // Slightly north of gym1
    longitude: -118.2637,
    rating: 4.5,
    reviews: [
      { id: "r3", userName: "Mike B.", rating: 5, comment: "Hardcore gym, all the weights you need.", date: "2024-05-10" },
    ],
    equipment: mockEquipment.filter(eq => eq.category === "Strength" || eq.id === "eq1"), // All strength + treadmill
    operatingHours: {
      Monday: "5:00 AM - 11:00 PM",
      Tuesday: "5:00 AM - 11:00 PM",
      Wednesday: "5:00 AM - 11:00 PM",
      Thursday: "5:00 AM - 11:00 PM",
      Friday: "5:00 AM - 10:00 PM",
      Saturday: "7:00 AM - 9:00 PM",
      Sunday: "Closed",
    },
    imageUrl: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    simulatedTravelTime: "15-20 mins drive",
    amenities: ["Heavy Lifting Zone", "Showers", "Protein Shakes"]
  },
  {
    id: "gym3",
    name: "Community Rec Center",
    address: "789 Wellness Blvd, Suburbia, ST 13579",
    latitude: 34.0322, // South of gym1
    longitude: -118.2237,
    rating: 4.2,
    reviews: [
      { id: "r4", userName: "Lisa G.", rating: 4, comment: "Good for families, has a pool too! Basic gym equipment.", date: "2024-04-20" },
    ],
    equipment: [mockEquipment[0], mockEquipment[2], mockEquipment[4], mockEquipment[12], mockEquipment[13]],
    operatingHours: {
      Monday: "7:00 AM - 9:00 PM",
      Tuesday: "7:00 AM - 9:00 PM",
      Wednesday: "7:00 AM - 9:00 PM",
      Thursday: "7:00 AM - 9:00 PM",
      Friday: "7:00 AM - 8:00 PM",
      Saturday: "9:00 AM - 5:00 PM",
      Sunday: "9:00 AM - 3:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    simulatedTravelTime: "5-10 mins drive",
    amenities: ["Swimming Pool", "Basketball Court", "Lockers", "Childcare"]
  },
  {
    id: "gym4",
    name: "Zenith Yoga & Fitness",
    address: "101 Balance Rd, Peaceful Place, ST 24680",
    latitude: 34.0550,
    longitude: -118.2000, // East of other gyms
    rating: 4.9,
    reviews: [
      { id: "r5", userName: "Chen W.", rating: 5, comment: "Beautiful yoga studio and decent functional fitness area.", date: "2024-05-05" },
    ],
    equipment: [mockEquipment[0], mockEquipment[2], mockEquipment[11], mockEquipment[12], mockEquipment[13], mockEquipment[14]],
    operatingHours: {
      Monday: "8:00 AM - 8:00 PM",
      Tuesday: "8:00 AM - 8:00 PM",
      Wednesday: "8:00 AM - 8:00 PM",
      Thursday: "8:00 AM - 8:00 PM",
      Friday: "8:00 AM - 7:00 PM",
      Saturday: "9:00 AM - 4:00 PM",
      Sunday: "9:00 AM - 2:00 PM",
    },
    imageUrl: "https://images.unsplash.com/photo-1540496905036-5937c10647cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    simulatedTravelTime: "20-25 mins drive",
    amenities: ["Yoga Studio", "Meditation Room", "Smoothie Bar", "Workshops"]
  }
];

// Helper function to get equipment by ID (could be used in components)
export const getEquipmentByIds = (ids: string[]): Equipment[] => {
  return mockEquipment.filter(eq => ids.includes(eq.id));
};
