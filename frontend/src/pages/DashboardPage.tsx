"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, BarChart, TrendingUp, Dumbbell, Clock, ChevronRight, Flame, Target, ArrowRight } from "lucide-react"
import { AnimatedBackground } from "./components/animated-background"

// Mock data for current program
const currentProgram = {
  name: "Hypertrophy Focus",
  progress: 65,
  daysCompleted: 18,
  totalDays: 28,
  nextWorkout: {
    name: "Upper Body Power",
    exercises: [
      { name: "Bench Press", sets: 4, reps: "6-8" },
      { name: "Barbell Row", sets: 4, reps: "6-8" },
      { name: "Overhead Press", sets: 3, reps: "8-10" },
      { name: "Pull-ups", sets: 3, reps: "8-10" },
      { name: "Tricep Extensions", sets: 3, reps: "10-12" },
    ],
    duration: 60,
  },
}

const DashboardPage = () => {
  const [duration, setDuration] = useState("60")
  const [gymType, setGymType] = useState("full")

  const userName = "Alex" // Replace with actual user data if available
  const weeklyProgress = 75 // Example percentage
  const modelUrl = "/assets/3d/duck.glb" // Placeholder model

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 z-0" />

      {/* Animated background - using particles by default */}
      <AnimatedBackground type="particles" opacity={0.2} speed={0.8} />

      <div className="container mx-auto p-6 relative z-10">
        <header className="mb-8 mt-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
            Welcome Back to Wellnash, {userName}
          </h1>
          <p className="text-lg text-gray-400 mt-2">Your fitness journey continues today.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Active Calories</CardTitle>
              <Flame className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">+2,350</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-400 mr-1">+520</span>
                <span className="text-xs text-gray-400">since last week</span>
              </div>
              <div className="w-full h-1 bg-gray-800 mt-3 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 w-[65%]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Workouts This Week</CardTitle>
              <BarChart className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">3/5</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400">2 workouts remaining</span>
              </div>
              <div className="flex justify-between mt-3">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div
                    key={day}
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      day <= 3
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                        : "bg-gray-800 text-gray-500"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-200">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{weeklyProgress}%</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400">On track to reach your goal</span>
              </div>
              <div className="w-full h-2 bg-gray-800 mt-3 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${weeklyProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Current Program */}
          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Target className="h-5 w-5 mr-2 text-blue-400" />
                Current Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h3 className="text-lg font-bold text-white">{currentProgram.name}</h3>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-blue-400">
                    {currentProgram.daysCompleted}/{currentProgram.totalDays} days
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-800 mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${currentProgram.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-200">Next Workout</h4>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {currentProgram.nextWorkout.duration} min
                  </span>
                </div>

                <h3 className="text-lg font-bold text-white mb-3">{currentProgram.nextWorkout.name}</h3>

                <div className="space-y-2">
                  {currentProgram.nextWorkout.exercises.slice(0, 3).map((exercise, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{exercise.name}</span>
                      <span className="text-gray-500">
                        {exercise.sets} × {exercise.reps}
                      </span>
                    </div>
                  ))}
                  {currentProgram.nextWorkout.exercises.length > 3 && (
                    <div className="text-sm text-blue-400 flex items-center cursor-pointer hover:text-blue-300 transition-colors">
                      +{currentProgram.nextWorkout.exercises.length - 3} more exercises
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  )}
                </div>

                <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 border-0 text-white">
                  Start Workout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 3D Model Viewer */}
          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden lg:col-span-2 h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center">
                <Activity className="h-5 w-5 mr-2 text-purple-400" />
                Weekly Volume Focus
              </CardTitle>
              <CardDescription className="text-gray-400">
                Visualize your training volume across different muscle groups
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] p-0 relative">
              {/* This is where the 3D model would go */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-gray-500">3D model visualization would appear here</div>
              </div>

              {/* Placeholder gradient effect for the 3D model area */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/20 z-0" />
              <div className="absolute inset-0 backdrop-blur-sm z-0" />
            </CardContent>
          </Card>
        </div>

        {/* Generate Workout Section */}
        <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden mb-8">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-white flex items-center">
              <Dumbbell className="h-5 w-5 mr-2 text-cyan-400" />
              Generate New Workout
            </CardTitle>
            <CardDescription className="text-gray-400">
              Customize and generate a new workout based on your preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Workout Duration</label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Gym Type</label>
                <Select value={gymType} onValueChange={setGymType}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select gym type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="full">Full Gym</SelectItem>
                    <SelectItem value="home">Home Gym</SelectItem>
                    <SelectItem value="minimal">Minimal Equipment</SelectItem>
                    <SelectItem value="bodyweight">Bodyweight Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
              Generate Workout
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-4">
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
            View Full Progress
          </Button>
          <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white">
            Workout History
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
