import React from "react";
import BodyModelViewer from "components/BodyModelViewer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Activity, BarChart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const navigate = useNavigate();

  const userName = "Alex"; // Replace with actual user data if available
  const weeklyProgress = 75; // Example percentage

  const modelUrl = "https://static.databutton.com/public/b9d6f579-db1c-4766-b9ed-7f49f3824576/3d_model.glb";

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 bg-gray-900 text-white">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white">Welcome Back to Wellnash, {userName}!</h1>
        <p className="text-lg text-gray-400">Here's your wellness dashboard.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Calories</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+2,350</div>
            <p className="text-xs text-gray-400">+520 since last week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Workouts This Week</CardTitle>
            <BarChart className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3/5</div>
            <p className="text-xs text-gray-400">2 workouts remaining</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg bg-gray-800 border-gray-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Weekly Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{weeklyProgress}%</div>
            <Progress value={weeklyProgress} className="w-full h-2 mt-2 bg-gray-700" />
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg col-span-1 md:col-span-3 h-[400px] md:h-[500px] lg:h-[600px] bg-gray-800 border-gray-700 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-white">Weekly Volume Focus</CardTitle>
          <p className="text-sm text-gray-400">
            Visualize your training volume across different muscle groups.
          </p>
        </CardHeader>
        <CardContent className="h-[calc(100%-4rem)] p-0">
          {modelUrl ? (
            <BodyModelViewer modelUrl={modelUrl} />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>Loading 3D model viewer...</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button onClick={() => navigate("/workout-recommendation")} className="mr-4 bg-purple-600 hover:bg-purple-700 text-white">
          Get New Workout Recommendation
        </Button>
        <Button onClick={() => navigate("/progress-page")} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white">
          View Full Progress
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
