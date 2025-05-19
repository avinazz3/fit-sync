import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LoggedWorkout, LoggedExerciseSet } from '../utils/workoutManager'; 
import { format } from 'date-fns';
import { TrendingUp } from 'lucide-react'; // Added TrendingUp

interface WorkoutProgressChartsProps {
  history: LoggedWorkout[];
}

// Helper to calculate total volume for a workout
const calculateTotalVolume = (workout: LoggedWorkout): number => {
  return workout.exercises.reduce((totalVol, exercise) => {
    return totalVol + exercise.loggedSets.reduce((exerciseVol, set) => {
      if (set.completed && typeof set.reps === 'number' && typeof set.weight === 'number') {
        return exerciseVol + (set.reps * set.weight);
      }
      return exerciseVol;
    }, 0);
  }, 0);
};

// Helper to extract max weight for a specific exercise from a workout
const getMaxWeightForExerciseInWorkout = (workout: LoggedWorkout, exerciseName: string): number | null => {
  let maxWeight: number | null = null;
  workout.exercises.forEach(exercise => {
    if (exercise.name.toLowerCase() === exerciseName.toLowerCase()) {
      exercise.loggedSets.forEach(set => {
        if (set.completed && typeof set.weight === 'number') {
          if (maxWeight === null || set.weight > maxWeight) {
            maxWeight = set.weight;
          }
        }
      });
    }
  });
  return maxWeight;
};

const WorkoutProgressCharts: React.FC<WorkoutProgressChartsProps> = ({ history }) => {
  if (!history || history.length === 0) {
    return <p className="text-center text-gray-500 py-4">No workout data available to display charts.</p>;
  }

  // Data for Volume Chart
  const volumeChartData = history
    .map(workout => ({
      date: new Date(workout.endTime),
      volume: calculateTotalVolume(workout),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(data => ({
      name: format(data.date, 'MMM d'),
      volume: data.volume,
    }));

  // Data for Max Weight Chart (e.g., for Barbell Squat)
  const specificExerciseName = "Barbell Squat";
  const maxWeightChartData = history
    .map(workout => ({
      date: new Date(workout.endTime),
      maxWeight: getMaxWeightForExerciseInWorkout(workout, specificExerciseName),
    }))
    .filter(data => data.maxWeight !== null)
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .map(data => ({
      name: format(data.date, 'MMM d'),
      maxWeight: data.maxWeight,
    }));

  // --- Projections Logic ---
  let volumeProjectionText: string | null = null;
  if (volumeChartData.length >= 2) {
    const lastEntries = volumeChartData.slice(-Math.min(volumeChartData.length, 3));
    const avgRecentVolume = lastEntries.reduce((sum, item) => sum + (item.volume || 0), 0) / lastEntries.length;
    if (avgRecentVolume > 0) {
      volumeProjectionText = `Your recent average workout volume is around ${Math.round(avgRecentVolume).toLocaleString()} kg. Keep up the great work!`;
    }
  } else if (volumeChartData.length === 1 && volumeChartData[0].volume && volumeChartData[0].volume > 0) {
    volumeProjectionText = `Your first logged workout had a volume of ${Math.round(volumeChartData[0].volume).toLocaleString()} kg. Great start!`;
  }

  let maxWeightProjectionText: string | null = null;
  if (maxWeightChartData.length >= 2) {
    const lastEntries = maxWeightChartData.slice(-Math.min(maxWeightChartData.length, 3));
    const avgRecentMaxWeight = lastEntries.reduce((sum, item) => sum + (item.maxWeight || 0), 0) / lastEntries.length;
    if (avgRecentMaxWeight > 0) {
      maxWeightProjectionText = `For ${specificExerciseName}, you're averaging around ${Math.round(avgRecentMaxWeight).toLocaleString()} kg on your heaviest sets. Strong progress!`;
    }
  } else if (maxWeightChartData.length === 1 && maxWeightChartData[0].maxWeight && maxWeightChartData[0].maxWeight > 0) {
    maxWeightProjectionText = `Your first logged max weight for ${specificExerciseName} was ${Math.round(maxWeightChartData[0].maxWeight).toLocaleString()} kg. Keep it up!`;
  }

  return (
    <div className="space-y-8">
      {/* Volume Chart */}
      <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Total Workout Volume Over Time</h3>
        {volumeChartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={volumeChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} label={{ value: 'Volume (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="volume" stroke="#8884d8" activeDot={{ r: 8 }} name="Total Volume" />
              </LineChart>
            </ResponsiveContainer>
            {volumeProjectionText && (
              <div className="mt-3 p-3 text-sm text-purple-700 bg-purple-50 border border-purple-200 rounded-md flex items-start">
                <TrendingUp size={20} className="mr-2 text-purple-500 flex-shrink-0 mt-0.5" />
                <p>{volumeProjectionText}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">No data for volume chart.</p>
        )}
      </div>

      {/* Max Weight Chart */}
      <div className="p-4 bg-white shadow-md rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Max Weight Over Time: {specificExerciseName}</h3>
        {maxWeightChartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={maxWeightChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} label={{ value: 'Max Weight (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="maxWeight" stroke="#82ca9d" activeDot={{ r: 8 }} name={`Max Weight (${specificExerciseName})`} />
              </LineChart>
            </ResponsiveContainer>
            {maxWeightProjectionText && (
              <div className="mt-3 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md flex items-start">
                <TrendingUp size={20} className="mr-2 text-green-500 flex-shrink-0 mt-0.5" />
                <p>{maxWeightProjectionText}</p>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500 py-4">No data for {specificExerciseName} in the selected period or no workouts logged for this exercise.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutProgressCharts;
