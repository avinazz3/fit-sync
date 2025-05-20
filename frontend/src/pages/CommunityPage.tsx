"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Users, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WaveBackground } from "./components/wave-background"

export default function CommunityPage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      {/* Background effects */}
      <WaveBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20 z-0" />

      <div className="relative z-10 container max-w-4xl mx-auto px-4 py-12 text-center">
        <div 
          className={`transform transition-all duration-1000 ${
            isLoaded ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="inline-flex items-center justify-center p-3 mb-8 rounded-full bg-purple-900/30 backdrop-blur-sm border border-purple-800/50">
            <Users className="h-8 w-8 text-purple-400" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400">
            Community Features
          </h1>
          
          <h2 className="text-xl md:text-2xl font-medium text-gray-300 mb-6">
            Coming in our next release
          </h2>

          <Card className="bg-gray-900/60 border-0 backdrop-blur-sm shadow-[0_0_15px_rgba(139,92,246,0.15)] overflow-hidden max-w-2xl mx-auto mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white flex items-center justify-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                Upcoming Features
              </CardTitle>
              <CardDescription className="text-gray-400 text-center">
                Here's what to expect in our community section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-left">
              <div className="p-3 rounded-lg bg-gray-800/70 backdrop-blur-sm border border-gray-700/50">
                <h3 className="font-medium text-purple-300 mb-1">Connect with fitness buddies</h3>
                <p className="text-gray-400 text-sm">Find and connect with like-minded individuals on their wellness journey</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-800/70 backdrop-blur-sm border border-gray-700/50">
                <h3 className="font-medium text-blue-300 mb-1">Workout sharing</h3>
                <p className="text-gray-400 text-sm">Share your favorite workouts and discover new routines from others</p>
              </div>
              
              <div className="p-3 rounded-lg bg-gray-800/70 backdrop-blur-sm border border-gray-700/50">
                <h3 className="font-medium text-cyan-300 mb-1">Challenges & events</h3>
                <p className="text-gray-400 text-sm">Participate in community challenges and virtual events</p>
              </div>
            </CardContent>
          </Card>

          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            We're working hard to bring you these exciting community features. Stay tuned for updates and be the first to experience the Wellnash community!
          </p>

          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
