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
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground">Welcome Back, {userName}!</h1>
        <p className="text-lg text-muted-foreground">Here’s your fitness dashboard.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Calories</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2,350</div>
              <p className="text-xs text-muted-foreground">+520 since last week</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workouts This Week</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <p className="text-xs text-muted-foreground">2 workouts remaining</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Weekly Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyProgress}%</div>
              <Progress value={weeklyProgress} className="w-full h-2 mt-2" />
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-lg col-span-1 md:col-span-3 h-[400px] md:h-[500px] lg:h-[600px]">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Weekly Volume Focus</CardTitle>
            <p className="text-sm text-muted-foreground">
              Visualize your training volume across different muscle groups.
            </p>
          </CardHeader>
          <CardContent className="h-[calc(100%-4rem)] p-0">
            {modelUrl ? (
              <BodyModelViewer modelUrl={modelUrl} />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <p>Loading 3D model viewer...</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Button onClick={() => navigate("/workout-recommendation")} className="mr-4">
            Get New Workout Recommendation
          </Button>
          <Button onClick={() => navigate("/progress-page")} variant="outline">
            View Full Progress
          </Button>
        </div>

    </div>
  );
};

export default DashboardPage;
