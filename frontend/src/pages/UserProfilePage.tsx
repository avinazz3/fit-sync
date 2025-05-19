import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter as DialogFooterComponent,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    User,
    Shield,
    BarChart3,
    Settings2,
    Edit3,
    Star,
    MapPin as MapPinIcon,
    CalendarDays,
    Info,
    Dumbbell,
    Flame,
    Clock,
    ChevronRight,
    Award,
    Zap,
    TrendingUp,
    TargetIcon,
    Bell, 
    Palette, 
    Smartphone
} from 'lucide-react';

interface UserProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
  memberSince: string;
  avatarUrl: string;
}

interface WorkoutEntry {
    id: string;
    date: string;
    type: string;
    duration: string;
    calories: number;
    icon?: React.ElementType;
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    achievedDate: string;
    icon: React.ElementType;
    color: string;
}

interface AppSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    theme: 'light' | 'dark' | 'system';
}

interface WorkoutPreferences {
  primaryGoal: string;
  injuries: string;
  preferredDuration: string; // minutes
  workoutsPerWeek: string;
}

const mockWorkoutHistory: WorkoutEntry[] = [
    { id: "wk1", date: "May 15, 2025", type: "Strength Training", duration: "60 mins", calories: 350, icon: Dumbbell },
    { id: "wk2", date: "May 13, 2025", type: "Cardio - Running", duration: "30 mins", calories: 280, icon: Flame },
    { id: "wk3", date: "May 11, 2025", type: "Yoga & Flexibility", duration: "45 mins", calories: 180 },
    { id: "wk4", date: "May 10, 2025", type: "HIIT Blast", duration: "20 mins", calories: 220, icon: Zap },
];

const mockAchievements: Achievement[] = [
    { id: "ach1", name: "Early Riser", description: "Completed 10 workouts before 7 AM.", achievedDate: "April 20, 2025", icon: Award, color: "text-yellow-500 bg-yellow-100 border-yellow-300" },
    { id: "ach2", name: "Consistent Strider", description: "Logged workouts for 7 consecutive days.", achievedDate: "May 05, 2025", icon: TrendingUp, color: "text-green-500 bg-green-100 border-green-300" },
    { id: "ach3", name: "Calorie Crusher", description: "Burned over 5000 calories in a week.", achievedDate: "May 12, 2025", icon: Flame, color: "text-red-500 bg-red-100 border-red-300" },
    { id: "ach4", name: "Goal Getter", description: "Reached a personal fitness goal.", achievedDate: "March 10, 2025", icon: TargetIcon, color: "text-blue-500 bg-blue-100 border-blue-300" },
    { id: "ach5", name: "Strength Starter", description: "Completed first 5 strength workouts.", achievedDate: "February 28, 2025", icon: Dumbbell, color: "text-indigo-500 bg-indigo-100 border-indigo-300" },
];

const UserProfilePage = () => {
  const [userData, setUserData] = useState<UserProfileData>({
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    bio: "Fitness enthusiast, love hiking and exploring new workout routines. Committed to a healthy lifestyle and always looking for the next challenge!",
    location: "San Francisco, CA",
    memberSince: "January 15, 2023",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
  });

  const [editData, setEditData] = useState<UserProfileData>(userData);
  
  const [appSettings, setAppSettings] = useState<AppSettings>({
    emailNotifications: true,
    pushNotifications: false,
    theme: 'light',
  });

  const [workoutPreferences, setWorkoutPreferences] = useState<WorkoutPreferences>({
    primaryGoal: 'muscle-gain',
    injuries: 'Slight lower back pain, avoid heavy squats.',
    preferredDuration: '60',
    workoutsPerWeek: '3-4',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
    setUserData(editData);
    // Potentially save appSettings here too if they were in the same form/dialog
  };

  const onOpenChangeDialog = (isOpen: boolean) => {
    if (isOpen) {
        setEditData(userData);
    }
  };

  const handleAppSettingsChange = (key: keyof AppSettings, value: boolean | ('light' | 'dark' | 'system')) => {
    setAppSettings(prev => ({...prev, [key]: value}));
    console.log(`App Setting Changed: ${key} to ${value}`);
    // In a real app, you might call useTheme().setTheme() for theme changes
    // or send updates to a backend.
  };

  const handleWorkoutPreferencesChange = (key: keyof WorkoutPreferences, value: string) => {
    setWorkoutPreferences(prev => ({...prev, [key]: value}));
    console.log(`Workout Preference Changed: ${key} to ${value}`);
    // In a real app, this would likely save to a backend or local storage
  };

  return (
    <Dialog onOpenChange={onOpenChangeDialog}>
      <TooltipProvider>
        <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6 lg:px-8">
          <header className="mb-10 flex flex-col items-center sm:flex-row sm:items-end">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32 border-4 border-white shadow-xl mb-4 sm:mb-0 sm:mr-6 ring-2 ring-purple-300">
              <AvatarImage src={userData.avatarUrl} alt={userData.name} />
              <AvatarFallback className="text-4xl bg-gray-200 text-gray-700">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-grow">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 text-center sm:text-left tracking-tight">{userData.name}</h1>
                <p className="text-md text-gray-600 text-center sm:text-left">{userData.email}</p>
            </div>
            <DialogTrigger asChild>
              <Button variant="outline" className="mt-4 sm:mt-0 text-sm text-purple-600 border-purple-300 hover:bg-purple-50 hover:text-purple-700 transition-colors flex items-center shadow-sm">
                  <Edit3 size={16} className="mr-2" /> Edit Profile
              </Button>
            </DialogTrigger>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* About Me Card */}
            <Card className="shadow-lg rounded-xl md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">About Me</CardTitle>
                <Info className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed italic">{userData.bio || "No bio provided."}</p>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon size={14} className="mr-2.5 text-gray-400" /> {userData.location || "Location not set"}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                      <CalendarDays size={14} className="mr-2.5 text-gray-400" /> Member since {userData.memberSince}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity Card */}
            <Card className="shadow-lg rounded-xl md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-700">Recent Activity</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                {mockWorkoutHistory.length > 0 ? (
                  <ul className="space-y-3">
                    {mockWorkoutHistory.slice(0, 3).map((workout) => {
                      const WorkoutIcon = workout.icon || Dumbbell;
                      return (
                          <li key={workout.id} className="flex items-center p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                              <WorkoutIcon className="h-8 w-8 text-purple-500 mr-4 p-1.5 bg-purple-100 rounded-md" />
                              <div className="flex-grow">
                                  <p className="font-medium text-gray-700 text-sm">{workout.type}</p>
                                  <p className="text-xs text-gray-500">{workout.date}</p>
                              </div>
                              <div className="text-right">
                                  <p className="text-sm font-semibold text-purple-600 flex items-center">
                                      <Flame size={12} className="mr-1 text-orange-500" /> {workout.calories} kcal
                                  </p>
                                  <p className="text-xs text-gray-500 flex items-center justify-end">
                                      <Clock size={12} className="mr-1" /> {workout.duration}
                                  </p>
                              </div>
                          </li>
                      );
                    })}
                    {mockWorkoutHistory.length > 3 && (
                       <Button variant="link" className="text-purple-600 hover:text-purple-800 text-sm p-0 h-auto mt-3 float-right font-medium">
                          View All Activity <ChevronRight size={16} className="ml-1" />
                      </Button>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 py-6 text-center">No recent workouts logged.</p>
                )}
              </CardContent>
            </Card>

            {/* Achievements Card */}
            <Card className="shadow-lg rounded-xl md:col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">Achievements</CardTitle>
                <Star className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent>
                {mockAchievements.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {mockAchievements.map((achievement) => {
                      const AchievementIcon = achievement.icon;
                      return (
                        <Tooltip key={achievement.id} delayDuration={100}>
                          <TooltipTrigger asChild>
                            <div className={`flex flex-col items-center justify-center p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer ${achievement.color.replace("text-", "border-").replace("bg-", "hover:bg-")}`}>
                                <AchievementIcon className={`h-10 w-10 p-2 rounded-full ${achievement.color}`} />
                                <p className="mt-2 text-xs font-medium text-center text-gray-700 truncate w-full">{achievement.name}</p>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className="bg-gray-800 text-white rounded-md shadow-lg max-w-xs">
                            <p className="font-semibold text-sm">{achievement.name}</p>
                            <p className="text-xs mt-0.5">{achievement.description}</p>
                            <p className="text-xs text-gray-400 mt-1.5">Achieved: {achievement.achievedDate}</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 py-6 text-center">No achievements unlocked yet. Keep going!</p>
                )}
              </CardContent>
            </Card>

            {/* App Settings Card */}
            <Card className="shadow-lg rounded-xl md:col-span-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-lg font-semibold text-gray-700">App Settings</CardTitle>
                <Settings2 className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2.5 flex items-center">
                    <Bell size={15} className="mr-2 text-gray-500" /> Notifications
                  </Label>
                  <div className="space-y-3 pl-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="emailNotifications" className="text-xs text-gray-600 cursor-pointer flex items-center">
                        <User size={12} className="mr-1.5 text-gray-400"/> Email Updates
                      </Label>
                      <Switch
                        id="emailNotifications"
                        checked={appSettings.emailNotifications}
                        onCheckedChange={(checked) => handleAppSettingsChange('emailNotifications', checked)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="pushNotifications" className="text-xs text-gray-600 cursor-pointer flex items-center">
                         <Smartphone size={12} className="mr-1.5 text-gray-400"/> Mobile Alerts
                      </Label>
                      <Switch
                        id="pushNotifications"
                        checked={appSettings.pushNotifications}
                        onCheckedChange={(checked) => handleAppSettingsChange('pushNotifications', checked)}
                        className="data-[state=checked]:bg-purple-600"
                      />
                    </div>
                  </div>
                </div>
                <div className="border-t pt-4 space-y-2.5">
                  <Label className="text-sm font-medium text-gray-700 flex items-center">
                     <Palette size={15} className="mr-2 text-gray-500" /> Theme
                  </Label>
                  <RadioGroup
                    value={appSettings.theme}
                    onValueChange={(value) => handleAppSettingsChange('theme', value as 'light' | 'dark' | 'system')}
                    className="space-y-2 pl-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="theme-light" className="text-purple-600 border-purple-300 data-[state=checked]:border-purple-600" />
                      <Label htmlFor="theme-light" className="text-xs text-gray-600 font-normal cursor-pointer">Light</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="theme-dark" className="text-purple-600 border-purple-300 data-[state=checked]:border-purple-600" />
                      <Label htmlFor="theme-dark" className="text-xs text-gray-600 font-normal cursor-pointer">Dark</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="theme-system" className="text-purple-600 border-purple-300 data-[state=checked]:border-purple-600" />
                      <Label htmlFor="theme-system" className="text-xs text-gray-600 font-normal cursor-pointer">System</Label>
                    </div>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Workout Preferences Card */}
            <Card className="shadow-lg rounded-xl md:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold text-gray-700">Workout Preferences</CardTitle>
                <Shield className="h-5 w-5 text-purple-500" />
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="space-y-1.5">
                  <Label htmlFor="primaryGoal" className="text-sm font-medium text-gray-700 flex items-center">
                    <TargetIcon size={14} className="mr-2 text-gray-500"/> Primary Fitness Goal
                  </Label>
                  {/* @ts-ignore */}
                  <Select value={workoutPreferences.primaryGoal} onValueChange={(value) => handleWorkoutPreferencesChange('primaryGoal', value)}>
                    <SelectTrigger id="primaryGoal" className="w-full">
                      <SelectValue placeholder="Select your primary goal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight-loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="general-fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="injuries" className="text-sm font-medium text-gray-700 flex items-center">
                    <Info size={14} className="mr-2 text-gray-500"/> Injuries/Limitations
                  </Label>
                  <Textarea 
                    id="injuries" 
                    name="injuries" 
                    value={workoutPreferences.injuries} 
                    onChange={(e) => handleWorkoutPreferencesChange('injuries', e.target.value)} 
                    className="w-full min-h-[70px]" 
                    placeholder="e.g., Knee pain, prefer low-impact exercises"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="preferredDuration" className="text-sm font-medium text-gray-700 flex items-center">
                           <Clock size={14} className="mr-2 text-gray-500"/> Duration (min)
                        </Label>
                        <Input 
                            id="preferredDuration" 
                            name="preferredDuration" 
                            type="number" 
                            value={workoutPreferences.preferredDuration} 
                            onChange={(e) => handleWorkoutPreferencesChange('preferredDuration', e.target.value)} 
                            className="w-full" 
                            placeholder="e.g., 45"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="workoutsPerWeek" className="text-sm font-medium text-gray-700 flex items-center">
                            <CalendarDays size={14} className="mr-2 text-gray-500"/> Sessions/Week
                        </Label>
                         {/* @ts-ignore */}
                        <Select value={workoutPreferences.workoutsPerWeek} onValueChange={(value) => handleWorkoutPreferencesChange('workoutsPerWeek', value)}>
                            <SelectTrigger id="workoutsPerWeek" className="w-full">
                            <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-2">1-2 times</SelectItem>
                                <SelectItem value="3-4">3-4 times</SelectItem>
                                <SelectItem value="5+">5+ times</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <Button onClick={() => console.log('Workout preferences saved:', workoutPreferences)} className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-3">
                    Save Preferences
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </TooltipProvider>

      {/* Edit Profile Dialog */}
      <DialogContent className="sm:max-w-lg bg-white p-0 rounded-lg shadow-xl">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold text-gray-800">Edit Your Information</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Make changes to your profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
            <Input id="name" name="name" value={editData.name} onChange={handleInputChange} className="w-full" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
            <Input id="email" name="email" type="email" value={editData.email} onChange={handleInputChange} className="w-full" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
            <Textarea id="bio" name="bio" value={editData.bio} onChange={handleInputChange} className="w-full min-h-[80px]" placeholder="Tell us a little about yourself" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
            <Input id="location" name="location" value={editData.location} onChange={handleInputChange} className="w-full" placeholder="e.g., San Francisco, CA" />
          </div>
           <div className="space-y-1.5">
            <Label htmlFor="avatarUrl" className="text-sm font-medium text-gray-700">Avatar URL</Label>
            <Input id="avatarUrl" name="avatarUrl" value={editData.avatarUrl} onChange={handleInputChange} className="w-full" placeholder="https://example.com/avatar.jpg" />
          </div>
        </div>
        <DialogFooterComponent className="px-6 py-4 border-t bg-slate-50 rounded-b-lg">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={handleSaveChanges} className="bg-purple-600 hover:bg-purple-700 text-white">Save Changes</Button>
          </DialogClose>
        </DialogFooterComponent>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfilePage;
