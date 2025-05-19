import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge as BadgeType } from '../utils/achievementsManager'; // Renamed to avoid conflict
import {
  PlayCircle,
  CalendarCheck,
  Dumbbell,
  Award, // Default or fallback icon
  Icon as LucideIcon, // Generic icon type
} from 'lucide-react';
import { format } from 'date-fns';

interface BadgeDisplayCardProps {
  badge: BadgeType;
}

// Map icon names to actual Lucide components
const iconComponents: { [key: string]: LucideIcon } = {
  PlayCircle,
  CalendarCheck,
  Dumbbell,
  Award, // Default
};

const BadgeDisplayCard: React.FC<BadgeDisplayCardProps> = ({ badge }) => {
  const IconComponent = iconComponents[badge.iconName] || Award; // Fallback to Award icon

  return (
    <Card className="w-full sm:w-[280px] h-full flex flex-col bg-white shadow-lg hover:shadow-xl transition-shadow duration-200 rounded-xl border border-gray-200 overflow-hidden">
      <CardHeader className="p-4 flex flex-row items-center space-x-3 bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <IconComponent className={`w-10 h-10 p-2 rounded-lg text-purple-600 bg-purple-100/70`} />
        <div>
            <CardTitle className="text-md font-semibold text-purple-700">{badge.name}</CardTitle>
            {badge.earnedDate && (
                <p className="text-xs text-gray-500 mt-0.5">
                    Earned: {format(new Date(badge.earnedDate), "MMM d, yyyy")}
                </p>
            )}
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm text-gray-600 flex-grow">
        <p>{badge.description}</p>
      </CardContent>
    </Card>
  );
};

export default BadgeDisplayCard;
