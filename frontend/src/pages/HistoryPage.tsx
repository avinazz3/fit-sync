"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  Clock,
  ListChecks,
  Activity,
  Weight,
  Repeat,
  Edit3,
  Award,
  TrendingUp,
  CalendarIcon,
  Trophy,
  Dumbbell,
} from "lucide-react"
import { format, isSameDay, subDays } from "date-fns"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock types
interface LoggedExerciseSet {
  weight: number | null
  reps: number | string
  completed: boolean
}

interface LoggedExercise {
  id: string
  name: string
  loggedSets: LoggedExerciseSet[]
}

interface LoggedWorkout {
  id: string
  planName: string
  startTime: string
  endTime: string
  durationMinutes: number
  exercises: LoggedExercise[]
  programDayTag?: string
  overallNotes?: string
}

// Mock data for badges
const mockBadges = [
  {
    id: "badge1",
    name: "First Workout",
    description: "Completed your first workout",
    icon: "🏋️",
    dateEarned: new Date().toISOString(),
    type: "achievement",
  },
  {
    id: "badge2",
    name: "Consistency King",
    description: "Completed 5 workouts in a row",
    icon: "👑",
    dateEarned: new Date().toISOString(),
    type: "streak",
  },
  {
    id: "badge3",
    name: "Volume Master",
    description: "Lifted over 5000kg in a single workout",
    icon: "💪",
    dateEarned: new Date().toISOString(),
    type: "strength",
  },
  {
    id: "badge4",
    name: "Early Bird",
    description: "Completed 3 workouts before 8am",
    icon: "🌅",
    dateEarned: new Date().toISOString(),
    type: "habit",
  },
]

// Mock data for workout history
const generateMockWorkoutHistory = (): LoggedWorkout[] => {
  const workouts: LoggedWorkout[] = []
  const workoutTypes = ["Push Day", "Pull Day", "Leg Day", "Upper Body", "Lower Body", "Full Body"]
  const exerciseNames = {
    push: ["Bench Press", "Overhead Press", "Tricep Extensions", "Lateral Raises", "Chest Flyes"],
    pull: ["Pull-ups", "Barbell Rows", "Bicep Curls", "Face Pulls", "Lat Pulldowns"],
    legs: ["Squats", "Deadlifts", "Leg Press", "Leg Extensions", "Calf Raises"],
  }

  // Generate 20 workouts over the past 60 days
  for (let i = 0; i < 20; i++) {
    const daysAgo = Math.floor(Math.random() * 60)
    const workoutDate = subDays(new Date(), daysAgo)
    const workoutType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)]
    const duration = 30 + Math.floor(Math.random() * 60)

    const exercises: LoggedExercise[] = []
    const exerciseCount = 3 + Math.floor(Math.random() * 4)

    // Determine which exercises to include based on workout type
    let exercisePool: string[] = []
    if (workoutType.includes("Push")) {
      exercisePool = [...exerciseNames.push]
    } else if (workoutType.includes("Pull")) {
      exercisePool = [...exerciseNames.pull]
    } else if (workoutType.includes("Leg")) {
      exercisePool = [...exerciseNames.legs]
    } else if (workoutType.includes("Upper")) {
      exercisePool = [...exerciseNames.push, ...exerciseNames.pull]
    } else if (workoutType.includes("Lower")) {
      exercisePool = [...exerciseNames.legs]
    } else {
      exercisePool = [...exerciseNames.push, ...exerciseNames.pull, ...exerciseNames.legs]
    }

    // Shuffle and pick exercises
    const shuffled = [...exercisePool].sort(() => 0.5 - Math.random())
    const selectedExercises = shuffled.slice(0, exerciseCount)

    // Create exercises with sets
    selectedExercises.forEach((name) => {
      const setCount = 3 + Math.floor(Math.random() * 2)
      const sets: LoggedExerciseSet[] = []

      for (let j = 0; j < setCount; j++) {
        const weight = 20 + Math.floor(Math.random() * 100)
        const reps = 6 + Math.floor(Math.random() * 10)
        sets.push({
          weight,
          reps,
          completed: Math.random() > 0.1, // 90% chance of completion
        })
      }

      exercises.push({
        id: `ex-${i}-${name.replace(/\s/g, "-").toLowerCase()}`,
        name,
        loggedSets: sets,
      })
    })

    // Create the workout
    workouts.push({
      id: `workout-${i}`,
      planName: workoutType,
      startTime: new Date(workoutDate.setHours(8 + Math.floor(Math.random() * 12))).toISOString(),
      endTime: new Date(workoutDate.setHours(9 + Math.floor(Math.random() * 12))).toISOString(),
      durationMinutes: duration,
      exercises,
      programDayTag: Math.random() > 0.5 ? `Week ${1 + Math.floor(i / 3)} Day ${1 + (i % 3)}` : undefined,
      overallNotes: Math.random() > 0.7 ? "Felt strong today. Increased weight on main lifts." : undefined,
    })
  }

  return workouts.sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
}

// Mock utility functions
const getWorkoutHistory = (): LoggedWorkout[] => {
  return generateMockWorkoutHistory()
}

const calculateTotalVolume = (workout: LoggedWorkout): number => {
  let totalVolume = 0
  workout.exercises.forEach((exercise) => {
    exercise.loggedSets.forEach((set) => {
      if (set.completed && typeof set.reps === "number" && typeof set.weight === "number") {
        totalVolume += set.reps * set.weight
      }
    })
  })
  return totalVolume
}

const checkAndGetAllEarnedBadges = (): any[] => {
  return mockBadges
}

// Mock data for exercise history
const exerciseOptions = ["Bench Press", "Squat", "Deadlift", "Overhead Press", "Pull-ups", "Barbell Row"]

const generateExerciseHistoryData = () => {
  const data: Record<string, Array<{ date: Date; weight: number; reps: number; volume: number }>> = {}

  exerciseOptions.forEach((exercise) => {
    const entries = []
    const entryCount = 5 + Math.floor(Math.random() * 3) // 5-7 entries

    let baseWeight = 0
    switch (exercise) {
      case "Bench Press":
        baseWeight = 60
        break
      case "Squat":
        baseWeight = 80
        break
      case "Deadlift":
        baseWeight = 100
        break
      case "Overhead Press":
        baseWeight = 40
        break
      case "Pull-ups":
        baseWeight = 0 // Bodyweight
        break
      case "Barbell Row":
        baseWeight = 50
        break
      default:
        baseWeight = 50
    }

    // Generate a progression with some randomness
    for (let i = 0; i < entryCount; i++) {
      const daysAgo = 60 - i * 10 // Every ~10 days
      // Progressive overload with some randomness
      const weight = baseWeight + i * 2.5 + (Math.random() > 0.7 ? 0 : 2.5)
      const reps = 5 + Math.floor(Math.random() * 3)
      const volume = weight * reps

      entries.push({
        date: subDays(new Date(), daysAgo + Math.floor(Math.random() * 3)), // Add some randomness
        weight,
        reps,
        volume,
      })
    }

    // Sort by date
    entries.sort((a, b) => a.date.getTime() - b.date.getTime())
    data[exercise] = entries
  })

  return data
}

const exerciseHistoryData = generateExerciseHistoryData()

// Format exercise history data for charts
const formatExerciseDataForChart = (exercise: string) => {
  return exerciseHistoryData[exercise]?.map((entry) => ({
    date: format(entry.date, "MMM d"),
    weight: entry.weight,
    reps: entry.reps,
    volume: entry.volume,
  }))
}

// Badge display component
const BadgeDisplayCard = ({ badge }: { badge: any }) => {
  return (
    <Card className="min-w-[200px] bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-md border-0 hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4 flex flex-col items-center">
        <div className="text-3xl mb-2">{badge.icon}</div>
        <h3 className="font-semibold text-sm text-center">{badge.name}</h3>
        <p className="text-xs text-gray-300 text-center mt-1">{badge.description}</p>
        <div className="mt-2 text-xs text-gray-400">{format(new Date(badge.dateEarned), "MMM d, yyyy")}</div>
      </CardContent>
    </Card>
  )
}

// Helper function to format duration from minutes to HH:MM:SS or similar
const formatDuration = (totalMinutes: number): string => {
  if (totalMinutes < 1) return "< 1 min"
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  let formatted = ""
  if (hours > 0) formatted += `${hours}h `
  if (minutes > 0) formatted += `${minutes}m`
  return formatted.trim()
}

// Helper function to find the best set for an exercise
const findBestSet = (exercise: LoggedExercise): string => {
  let bestSetDisplay = "N/A"
  let maxVolume = 0

  exercise.loggedSets.forEach((set) => {
    if (set.completed && typeof set.reps === "number" && typeof set.weight === "number") {
      const currentVolume = set.reps * set.weight
      if (currentVolume > maxVolume) {
        maxVolume = currentVolume
        bestSetDisplay = `${set.weight} kg × ${set.reps}`
      }
    } else if (set.completed && typeof set.reps === "string") {
      if (bestSetDisplay === "N/A" || maxVolume === 0) bestSetDisplay = `${set.reps}`
    }
  })
  return bestSetDisplay
}

const HistoryPage = () => {
  const [rawWorkoutHistory, setRawWorkoutHistory] = useState<LoggedWorkout[]>([])
  const [filteredWorkoutHistory, setFilteredWorkoutHistory] = useState<LoggedWorkout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [earnedBadges, setEarnedBadges] = useState<any[]>([])
  const [selectedExercise, setSelectedExercise] = useState(exerciseOptions[0])
  const [activeTab, setActiveTab] = useState("history")
  const [chartMetric, setChartMetric] = useState<"weight" | "volume">("weight")

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      const history = getWorkoutHistory()
      setRawWorkoutHistory(history)

      const badges = checkAndGetAllEarnedBadges()
      setEarnedBadges(badges)

      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    if (selectedDate && rawWorkoutHistory.length > 0) {
      const filtered = rawWorkoutHistory.filter((workout) => isSameDay(new Date(workout.endTime), selectedDate))
      setFilteredWorkoutHistory(filtered)
    } else {
      setFilteredWorkoutHistory(rawWorkoutHistory)
    }
  }, [selectedDate, rawWorkoutHistory])

  const workoutsForSelectedDate =
    selectedDate && rawWorkoutHistory.length > 0
      ? rawWorkoutHistory.filter((workout) => isSameDay(new Date(workout.endTime), selectedDate))
      : []

  const totalWorkoutsCount = rawWorkoutHistory.length
  const currentDisplayCount = selectedDate ? workoutsForSelectedDate.length : totalWorkoutsCount

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 min-h-screen flex flex-col items-center justify-center">
        <Activity className="w-12 h-12 text-purple-500 animate-spin mb-4" />
        <p className="text-xl font-medium text-white">Loading workout history...</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-gray-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Workout History</h1>
        <p className="text-gray-400 mt-1">Track your progress and achievements</p>
      </header>

      {/* Achievements Section - Now at the top */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <Trophy className="mr-2 text-yellow-500" /> Achievements
          </h2>
          <div className="bg-gray-800 text-yellow-500 px-3 py-1 rounded-md text-sm font-medium">
            {earnedBadges.length} Earned
          </div>
        </div>

        {earnedBadges.length > 0 ? (
          <ScrollArea className="w-full pb-3">
            <div className="flex space-x-4">
              {earnedBadges.map((badge) => (
                <BadgeDisplayCard key={badge.id} badge={badge} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-300">No achievements yet</h3>
              <p className="text-sm text-gray-500 mt-1">Complete workouts to earn badges and achievements!</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Calendar Section - Full width */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center">
            <CalendarIcon className="mr-2 text-blue-400" /> Workout Calendar
          </h2>
          <div className="bg-gray-800 text-blue-400 px-3 py-1 rounded-md text-sm font-medium">
            {totalWorkoutsCount} Total Workouts
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="flex justify-center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full max-w-4xl mx-auto rounded-md border-gray-700 bg-gray-800 text-white"
              classNames={{
                month: "w-full",
                table: "w-full border-collapse",
                row: "flex w-full",
                head_row: "flex w-full",
                cell: "h-9 w-full text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md",
                day: "h-9 w-full p-0 font-normal aria-selected:opacity-100",
                day_range_end: "day-range-end",
                day_selected:
                  "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
                day_today: "bg-gray-700 text-white",
                day_outside: "text-gray-500 opacity-50",
                day_disabled: "text-gray-500",
                day_hidden: "invisible",
              }}
              modifiers={{
                workoutDay: rawWorkoutHistory.map((workout) => new Date(workout.endTime)),
              }}
              modifiersStyles={{
                workoutDay: {
                  border: "2px solid #8B5CF6",
                  fontWeight: "bold",
                },
              }}
            />
          </div>
        </Card>
      </section>

      {/* Tabs for Recent Workouts and Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-6 bg-gray-800">
          <TabsTrigger value="history" className="flex items-center justify-center data-[state=active]:bg-gray-700">
            <Dumbbell className="mr-2 h-4 w-4" /> Recent Workouts
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center justify-center data-[state=active]:bg-gray-700">
            <TrendingUp className="mr-2 h-4 w-4" /> Exercise Analytics
          </TabsTrigger>
        </TabsList>

        {/* Recent Workouts Tab */}
        <TabsContent value="history" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              {selectedDate ? `Workouts on ${format(selectedDate, "MMMM d, yyyy")}` : "All Workouts"}
              {currentDisplayCount > 0 && <span className="ml-2 text-sm text-gray-400">({currentDisplayCount})</span>}
            </h2>
          </div>

          {filteredWorkoutHistory.length === 0 ? (
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <CalendarDays className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-300">
                  {selectedDate ? `No workouts on ${format(selectedDate, "MMMM d, yyyy")}` : "No workouts logged yet"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDate
                    ? "Select another date or log a new workout!"
                    : "Complete a workout to see your history."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[calc(100vh-32rem)]">
              <div className="space-y-4 pr-2">
                {filteredWorkoutHistory.map((workout) => {
                  const totalVolume = calculateTotalVolume(workout)
                  const totalSets = workout.exercises.reduce(
                    (acc, ex) => acc + ex.loggedSets.filter((s) => s.completed).length,
                    0,
                  )

                  return (
                    <Card
                      key={workout.id}
                      className="bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-200 border-gray-700 overflow-hidden"
                    >
                      <CardHeader className="p-4 border-b border-gray-700 bg-gray-800 flex flex-row justify-between items-start">
                        <div>
                          <CardTitle className="text-md sm:text-lg font-semibold text-purple-400">
                            {workout.planName || "Workout Session"}
                          </CardTitle>
                          <CardDescription className="text-xs text-gray-400 mt-0.5">
                            {format(new Date(workout.endTime), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                          </CardDescription>
                        </div>
                        {workout.programDayTag && (
                          <span className="text-xs bg-purple-900 text-purple-300 px-2 py-0.5 rounded-full font-medium self-start whitespace-nowrap">
                            {workout.programDayTag}
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="p-4">
                        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                          <div className="text-xs sm:text-sm">
                            <Clock size={14} className="mx-auto mb-1 text-blue-400" />
                            <span className="font-medium">{formatDuration(workout.durationMinutes)}</span>
                            <p className="text-gray-400">Duration</p>
                          </div>
                          <div className="text-xs sm:text-sm">
                            <Weight size={14} className="mx-auto mb-1 text-green-400" />
                            <span className="font-medium">{totalVolume.toLocaleString()} kg</span>
                            <p className="text-gray-400">Volume</p>
                          </div>
                          <div className="text-xs sm:text-sm">
                            <Repeat size={14} className="mx-auto mb-1 text-red-400" />
                            <span className="font-medium">{totalSets} sets</span>
                            <p className="text-gray-400">Total Sets</p>
                          </div>
                        </div>

                        {/* Exercises List */}
                        <div className="mt-4">
                          <h3 className="text-sm font-medium mb-2 flex items-center">
                            <ListChecks size={14} className="mr-1" /> Exercises
                          </h3>
                          <div className="text-sm grid gap-1">
                            {workout.exercises.map((exercise, i) => (
                              <div
                                key={`${workout.id}-${i}`}
                                className="py-1 border-b border-gray-700 last:border-0 grid grid-cols-3"
                              >
                                <div className="col-span-2">{exercise.name}</div>
                                <div className="text-right text-gray-400 font-medium text-xs">
                                  {findBestSet(exercise)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Notes if available */}
                        {workout.overallNotes && (
                          <div className="mt-4 border-t border-gray-700 pt-2">
                            <h3 className="text-sm font-medium mb-1 flex items-center">
                              <Edit3 size={14} className="mr-1" /> Notes
                            </h3>
                            <p className="text-xs text-gray-400">{workout.overallNotes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Exercise Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-white flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-400" /> Exercise Progress
              </h2>

              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setChartMetric("weight")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      chartMetric === "weight"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Weight
                  </button>
                  <button
                    onClick={() => setChartMetric("volume")}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      chartMetric === "volume"
                        ? "bg-purple-600 text-white"
                        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Volume
                  </button>
                </div>

                <Select value={selectedExercise} onValueChange={setSelectedExercise}>
                  <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select exercise" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    {exerciseOptions.map((exercise) => (
                      <SelectItem key={exercise} value={exercise} className="focus:bg-gray-700 focus:text-white">
                        {exercise}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold text-white">{selectedExercise} Progress</CardTitle>
                <CardDescription className="text-gray-400">
                  Tracking your {chartMetric === "weight" ? "strength" : "volume"} gains over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ChartContainer
                    config={{
                      [chartMetric]: {
                        label: chartMetric === "weight" ? "Weight (kg)" : "Volume (kg)",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={formatExerciseDataForChart(selectedExercise)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#9CA3AF"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey={chartMetric}
                          stroke="var(--color-weight)"
                          strokeWidth={2}
                          dot={{ r: 4, strokeWidth: 2 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>

                {/* Personal Records */}
                <div className="mt-6 pt-4 border-t border-gray-700">
                  <h4 className="text-sm font-medium mb-3 text-white">Personal Records</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-3">
                        <p className="text-xs text-purple-400">Max Weight</p>
                        <p className="text-lg font-bold text-white">
                          {Math.max(...(exerciseHistoryData[selectedExercise]?.map((entry) => entry.weight) || [0]))} kg
                        </p>
                      </CardContent>
                    </Card>
                    <Card className="bg-gray-900 border-gray-700">
                      <CardContent className="p-3">
                        <p className="text-xs text-blue-400">Max Volume (Single Set)</p>
                        <p className="text-lg font-bold text-white">
                          {Math.max(...(exerciseHistoryData[selectedExercise]?.map((entry) => entry.volume) || [0]))} kg
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HistoryPage
