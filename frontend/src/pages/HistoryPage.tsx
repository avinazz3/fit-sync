import React, { useState, useEffect } from 'react';
import { getWorkoutHistory, LoggedWorkout } from '../utils/workoutManager'; // Removed LoggedExercise, LoggedExerciseSet if not directly used here
import { calculateTotalVolume, checkAndGetAllEarnedBadges, Badge as BadgeType } from '../utils/achievementsManager'; // Added BadgeType and checkAndGetAllEarnedBadges
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarDays, Clock, ListChecks, Activity, AlertTriangle, Weight, Repeat, Edit3, Maximize, Award } from 'lucide-react'; // Added Award for section icon
import { format, isSameDay } from 'date-fns';
import WorkoutProgressCharts from '../components/WorkoutProgressCharts';
import BadgeDisplayCard from '../components/BadgeDisplayCard'; // Added import

// Helper function to format duration from minutes to HH:MM:SS or similar
const formatDuration = (totalMinutes: number): string => {
  if (totalMinutes < 1) return "< 1 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  let formatted = "";
  if (hours > 0) formatted += `${hours}h `;
  if (minutes > 0) formatted += `${minutes}m`;
  return formatted.trim();
};

// Helper function to find the best set for an exercise
const findBestSet = (exercise: LoggedExercise): string => {
  let bestSetDisplay = "N/A";
  let maxVolume = 0;

  exercise.loggedSets.forEach(set => {
    if (set.completed && typeof set.reps === 'number' && typeof set.weight === 'number') {
      const currentVolume = set.reps * set.weight;
      if (currentVolume > maxVolume) {
        maxVolume = currentVolume;
        bestSetDisplay = `${set.weight} kg x ${set.reps}`;
      }
    } else if (set.completed && typeof set.reps === 'string') { // For AMRAP or timed sets without numeric reps/weight
        // If it's the first completed non-numeric set, or to provide some display for it
        if (bestSetDisplay === "N/A" || maxVolume === 0) bestSetDisplay = `${set.reps}`;
    }
  });
  return bestSetDisplay;
};

const HistoryPage = () => {
  const [rawWorkoutHistory, setRawWorkoutHistory] = useState<LoggedWorkout[]>([]);
  const [filteredWorkoutHistory, setFilteredWorkoutHistory] = useState<LoggedWorkout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [earnedBadges, setEarnedBadges] = useState<BadgeType[]>([]); // State for earned badges

  useEffect(() => {
    const history = getWorkoutHistory();
    history.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime());
    setRawWorkoutHistory(history);
    
    const badges = checkAndGetAllEarnedBadges(history);
    setEarnedBadges(badges);

    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = rawWorkoutHistory.filter(workout => 
        isSameDay(new Date(workout.endTime), selectedDate)
      );
      setFilteredWorkoutHistory(filtered);
    } else {
      setFilteredWorkoutHistory(rawWorkoutHistory); // Show all if no date selected
    }
  }, [selectedDate, rawWorkoutHistory]);

  const workoutsForSelectedDate = selectedDate 
    ? rawWorkoutHistory.filter(workout => isSameDay(new Date(workout.endTime), selectedDate)) 
    : [];
  
  const totalWorkoutsCount = rawWorkoutHistory.length;
  // Count for selected day, or total if no day is selected (though calendar always has a day)
  const currentDisplayCount = selectedDate ? workoutsForSelectedDate.length : totalWorkoutsCount; 


  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 bg-white min-h-screen flex flex-col items-center justify-center text-gray-700">
        <Activity className="w-12 h-12 text-purple-600 animate-spin mb-4" />
        <p className="text-xl">Loading workout history...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex flex-col">
      <header className="mb-6 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">History</h1>
      </header>

      <div className="mb-6 flex justify-center">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border bg-white shadow-sm"
          // Modifiers to indicate days with workouts (example)
          modifiers={{
            workoutDay: rawWorkoutHistory.map(workout => new Date(workout.endTime))
          }}
          modifiersStyles={{
            workoutDay: { 
                border: "2px solid #8B5CF6", // Purple-500
                fontWeight: 'bold' 
            }
          }}
        />
      </div>

      {/* Progress Charts Section */}
      {rawWorkoutHistory.length > 0 && (
        <WorkoutProgressCharts history={rawWorkoutHistory} />
      )}

      {/* Achievements Section */}
      {earnedBadges.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
            <Award size={22} className="mr-2 text-yellow-500" /> Your Achievements
          </h2>
          <ScrollArea className="w-full pb-3">
            <div className="flex space-x-4">
              {earnedBadges.map(badge => (
                <BadgeDisplayCard key={badge.id} badge={badge} />
              ))}
            </div>
            <div className="h-1" /> {/* For ScrollArea bottom padding visibility if needed */}
          </ScrollArea>
        </div>
      )}

      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">
          Workout History ({currentDisplayCount})
        </h2>
        {/* Placeholder for potential future filter/sort options */}
      </div>

      {filteredWorkoutHistory.length === 0 ? (
        <Card className="bg-white shadow-md rounded-lg border-gray-200">
          <CardContent className="p-6 text-center">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              {selectedDate ? `No workouts logged on ${format(selectedDate, "MMMM d, yyyy")}` : "No workouts logged yet." }
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {selectedDate ? "Select another date or log a new workout!" : "Complete a workout to see your history."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="flex-grow h-[calc(100vh-26rem)] sm:h-[calc(100vh-28rem)] pr-2">
          <div className="space-y-4">
            {filteredWorkoutHistory.map((workout) => {
              const totalVolume = calculateTotalVolume(workout);
              const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.loggedSets.filter(s => s.completed).length, 0);
              return (
                <Card key={workout.id} className="bg-white shadow-md hover:shadow-lg transition-shadow duration-200 rounded-lg border-gray-200 overflow-hidden">
                  <CardHeader className="p-4 border-b bg-gray-50 flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-md sm:text-lg font-semibold text-purple-700">
                        {workout.planName || 'Workout Session'}
                      </CardTitle>
                      <CardDescription className="text-xs text-gray-500 mt-0.5">
                        {format(new Date(workout.endTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                      </CardDescription>
                    </div>
                    {workout.programDayTag && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium self-start whitespace-nowrap">
                        {workout.programDayTag}
                      </span>
                    )}
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                      <div className="text-xs sm:text-sm">
                        <Clock size={14} className="mx-auto mb-1 text-blue-500" />
                        <span className="font-medium">{formatDuration(workout.durationMinutes)}</span>
                        <p className="text-gray-500">Duration</p>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <Weight size={14} className="mx-auto mb-1 text-green-500" />
                        <span className="font-medium">{totalVolume.toLocaleString()} kg</span>
                        <p className="text-gray-500">Volume</p>
                      </div>
                      <div className="text-xs sm:text-sm">
                        <Repeat size={14} className="mx-auto mb-1 text-red-500" />
                        <span className="font-medium">{totalSets} sets</span>
                        <p className="text-gray-500">Total Sets</p>
                      </div>
                    </div>

                    {/* Exercises List - Collapsible for mobile */}
                    <div className="mt-4">
                      <h3 className="text-sm font-medium mb-2 flex items-center">
                        <ListChecks size={14} className="mr-1" /> Exercises
                      </h3>
                      <div className="text-sm grid gap-1">
                        {workout.exercises.map((exercise, i) => (
                          <div key={`${workout.id}-${i}`} className="py-1 border-b last:border-0 grid grid-cols-3">
                            <div className="col-span-2">{exercise.name}</div>
                            <div className="text-right text-gray-600 font-medium text-xs">
                              {findBestSet(exercise)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes if available */}
                    {workout.overallNotes && (
                      <div className="mt-4 border-t pt-2">
                        <h3 className="text-sm font-medium mb-1 flex items-center">
                          <Edit3 size={14} className="mr-1" /> Notes
                        </h3>
                        <p className="text-xs text-gray-600">{workout.overallNotes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default HistoryPage;
