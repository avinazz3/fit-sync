"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronRight, Search, SlidersHorizontal, Star, BookmarkPlus, ExternalLink } from "lucide-react"
import { AnimatedBackground } from "./components/animated-background"

// Program interface
interface Program {
  id: string
  title: string
  image: string
  creator: {
    name: string
    verified: boolean
  }
  rating: number
  usersJoined: number
  daysPerWeek: number
  difficulty: "Beginner" | "Intermediate" | "Novice - Advanced" | "Advanced"
  featured: boolean
  tags: string[]
  free: boolean
  pro: boolean
}

// Mock data for programs
const mockPrograms: Program[] = [
  {
    id: "p1",
    title: "nSuns 5/3/1",
    image: "/assets/programs/nsuns.jpg",
    creator: {
      name: "r/Fitness",
      verified: true
    },
    rating: 4.3,
    usersJoined: 38959,
    daysPerWeek: 5,
    difficulty: "Intermediate",
    featured: true,
    tags: ["Strength", "Powerlifting", "Bulking"],
    free: true,
    pro: false
  },
  {
    id: "p2",
    title: "Intermediate Bodybuilding Program (by Eric Helms)",
    image: "/assets/programs/bodybuilding.jpg",
    creator: {
      name: "Dr. Eric Helms",
      verified: true
    },
    rating: 4.18,
    usersJoined: 7151,
    daysPerWeek: 5,
    difficulty: "Intermediate",
    featured: true,
    tags: ["Bodybuilding", "Hypertrophy"],
    free: true,
    pro: false
  },
  {
    id: "p3",
    title: "Functional Strength 101",
    image: "/assets/programs/functional.jpg",
    creator: {
      name: "Justina Ercole",
      verified: true
    },
    rating: 4.3,
    usersJoined: 2288,
    daysPerWeek: 3,
    difficulty: "Beginner",
    featured: true,
    tags: ["Functional", "Full Body"],
    free: true,
    pro: false
  },
  {
    id: "p4",
    title: "MASS IMPACT",
    image: "/assets/programs/mass-impact.jpg",
    creator: {
      name: "Geoffrey Verity Schofield",
      verified: true
    },
    rating: 4.38,
    usersJoined: 1551,
    daysPerWeek: 5,
    difficulty: "Novice - Advanced",
    featured: true,
    tags: ["Hypertrophy", "Mass Building"],
    free: false,
    pro: true
  },
  {
    id: "p5",
    title: "Golden Warrior: Adaptive Program",
    image: "/assets/programs/adaptive.jpg",
    creator: {
      name: "Miranda Cohen",
      verified: true
    },
    rating: 4.9,
    usersJoined: 1247,
    daysPerWeek: 4,
    difficulty: "Beginner",
    featured: false,
    tags: ["Adaptive", "Mobility", "Therapeutic"],
    free: false,
    pro: true
  },
  {
    id: "p6",
    title: "PowerBuild: Strength & Size",
    image: "/assets/programs/powerbuild.jpg",
    creator: {
      name: "Alex Strength",
      verified: true
    },
    rating: 4.5,
    usersJoined: 5672,
    daysPerWeek: 4,
    difficulty: "Intermediate",
    featured: false,
    tags: ["Powerbuilding", "Hybrid"],
    free: true,
    pro: false
  },
  {
    id: "p7",
    title: "Women's Strength Fundamentals",
    image: "/assets/programs/womens.jpg",
    creator: {
      name: "Stephanie Powell",
      verified: true
    },
    rating: 4.7,
    usersJoined: 8923,
    daysPerWeek: 3,
    difficulty: "Beginner",
    featured: false,
    tags: ["Women", "Strength", "Toning"],
    free: true,
    pro: false
  },
  {
    id: "p8",
    title: "Elite Performance Protocol",
    image: "/assets/programs/elite.jpg",
    creator: {
      name: "Performance Lab",
      verified: true
    },
    rating: 4.6,
    usersJoined: 3421,
    daysPerWeek: 6,
    difficulty: "Advanced",
    featured: false,
    tags: ["Athletic", "Performance", "Advanced"],
    free: false,
    pro: true
  }
];

// Categories and filters
const categories = [
  { id: "pro", label: "Pro" },
  { id: "bodybuilding", label: "Bodybuilding" },
  { id: "powerlifting", label: "Powerlifting" },
  { id: "powerbuilding", label: "Powerbuilding" },
  { id: "functional", label: "Functional" },
  { id: "mobility", label: "Mobility" }
];

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [recommendedPrograms, setRecommendedPrograms] = useState<Program[]>(mockPrograms.slice(0, 2))
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(mockPrograms)

  // Format number with K for thousands
  const formatNumber = (num: number) => {
    return num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num
  }

  // Handle category filter
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    
    if (category === "all") {
      setFilteredPrograms(mockPrograms)
      return
    }
    
    if (category === "pro") {
      setFilteredPrograms(mockPrograms.filter(program => program.pro))
      return
    }
    
    setFilteredPrograms(
      mockPrograms.filter(program => 
        program.tags.some(tag => tag.toLowerCase() === category.toLowerCase())
      )
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated background */}
      <AnimatedBackground type="particles" opacity={0.2} speed={0.8} />

      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/10 to-cyan-900/10 z-0 pointer-events-none" />

      <div className="container mx-auto px-4 py-6 relative z-10">
        {/* Search & Filter */}
        <div className="relative mb-6 flex items-center gap-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              type="text" 
              placeholder="Search program title or coach name" 
              className="bg-gray-800/70 border-gray-700 rounded-full pl-10 pr-4 py-6 text-white placeholder:text-gray-400 w-full focus:ring-purple-500 focus:border-purple-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button className="bg-gray-800/70 hover:bg-gray-700 border border-gray-700 rounded-full h-12 w-12 flex items-center justify-center p-0">
            <SlidersHorizontal size={20} className="text-purple-400" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        {/* Recommended Programs Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              Your Recommended Programs
              <Badge variant="outline" className="ml-2 bg-gray-800/50 text-gray-400 border-gray-700 whitespace-nowrap">
                {recommendedPrograms.length}
              </Badge>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommendedPrograms.map(program => (
              <Card key={program.id} className="group bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden relative">
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10" />
                  {program.image ? (
                    <img 
                      src={program.image} 
                      alt={program.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{program.title.substring(0, 2)}</span>
                    </div>
                  )}
                  
                  {program.featured && (
                    <Badge className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white border-0 font-bold uppercase text-xs">
                      Featured
                    </Badge>
                  )}
                  
                  {program.pro && (
                    <Badge className="absolute top-3 right-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 font-bold uppercase text-xs">
                      PRO
                    </Badge>
                  )}
                  
                  <div className="absolute top-3 left-3 z-20 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1">
                    <div className="text-amber-400 font-bold text-xl">{program.title.split(' ')[0]}</div>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 text-white leading-tight line-clamp-1">
                    {program.title}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center text-sm text-gray-400">
                      By {program.creator.name}
                      {program.creator.verified && (
                        <div className="ml-1 bg-blue-500 rounded-full p-0.5">
                          <Check size={10} className="text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-white">{program.rating.toFixed(2)}</span>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      {formatNumber(program.usersJoined)} joined
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex gap-2">
                      <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                        {program.difficulty}
                      </Badge>
                      <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                        {program.daysPerWeek} days/week
                      </Badge>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
                      <ExternalLink size={18} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Categories and Browse Section */}
        <div>
          <Tabs defaultValue="byCoaches" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList className="bg-gray-800/50 border border-gray-700 h-10 rounded-lg p-1">
                <TabsTrigger 
                  value="byCoaches" 
                  className="rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  By Coaches
                </TabsTrigger>
                <TabsTrigger 
                  value="byUsers" 
                  className="rounded-md data-[state=active]:bg-purple-600 data-[state=active]:text-white"
                >
                  By Users
                </TabsTrigger>
              </TabsList>
              
              <div className="text-sm flex items-center">
                <span className="text-gray-400 mr-1">Sort:</span>
                <select className="bg-transparent text-white border-none focus:ring-0 cursor-pointer">
                  <option>Popular</option>
                  <option>Newest</option>
                  <option>Highest Rated</option>
                </select>
              </div>
            </div>
            
            {/* Category pills */}
            <div className="flex overflow-x-auto pb-2 mb-4 gap-2 no-scrollbar">
              <Button
                onClick={() => handleCategoryChange("all")}
                className={`rounded-full px-4 py-2 whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                }`}
              >
                All
              </Button>
              
              {categories.map(category => (
                <Button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`rounded-full px-4 py-2 whitespace-nowrap ${
                    activeCategory === category.id
                      ? "bg-purple-600 hover:bg-purple-700 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                  }`}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            <TabsContent value="byCoaches" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPrograms.map(program => (
                  <Card key={program.id} className="group bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden relative">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10" />
                      {program.image ? (
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">{program.title.substring(0, 2)}</span>
                        </div>
                      )}
                      
                      {program.featured && (
                        <Badge className="absolute bottom-3 left-3 z-20 bg-blue-600 text-white border-0 font-bold uppercase text-xs">
                          Featured
                        </Badge>
                      )}
                      
                      {program.pro && (
                        <Badge className="absolute top-3 right-3 z-20 bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 font-bold uppercase text-xs">
                          PRO
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-white leading-tight line-clamp-2">
                        {program.title}
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-sm text-gray-400">
                          By {program.creator.name}
                          {program.creator.verified && (
                            <div className="ml-1 bg-blue-500 rounded-full p-0.5">
                              <Check size={10} className="text-white" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-white">{program.rating.toFixed(2)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {formatNumber(program.usersJoined)} joined
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                            {program.difficulty}
                          </Badge>
                          <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                            {program.daysPerWeek} days/week
                          </Badge>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
                          <BookmarkPlus size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="byUsers" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Showing a subset of filtered programs for the "By Users" tab */}
                {filteredPrograms.slice(0, 3).map(program => (
                  <Card key={`user-${program.id}`} className="group bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden relative">
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60 z-10" />
                      {program.image ? (
                        <img 
                          src={program.image} 
                          alt={program.title} 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-900 to-blue-900 flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">{program.title.substring(0, 2)}</span>
                        </div>
                      )}
                      
                      {!program.pro && (
                        <Badge className="absolute top-3 right-3 z-20 bg-green-600 text-white border-0 font-bold uppercase text-xs">
                          FREE
                        </Badge>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-1 text-white leading-tight line-clamp-2">
                        {program.title} (Community Version)
                      </h3>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center text-sm text-gray-400">
                          By Community Member
                        </div>
                      </div>
                      
                      <div className="flex justify-between mb-3">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                          <span className="text-white">{(program.rating - 0.3).toFixed(2)}</span>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          {formatNumber(Math.floor(program.usersJoined / 3))} joined
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                            {program.difficulty}
                          </Badge>
                          <Badge className="bg-gray-700 text-gray-300 hover:bg-gray-600">
                            {program.daysPerWeek} days/week
                          </Badge>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="text-purple-400 hover:text-purple-300 hover:bg-purple-900/20">
                          <BookmarkPlus size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
