import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart, Zap, Users, MoveRight, Target, ShieldCheck, Bot } from "lucide-react";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      {/* Header / Navigation Placeholder - Can be a separate component later */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <a href="/" className="mr-6 flex items-center space-x-2">
            <Target className="h-6 w-6 text-primary" />
            <span className="font-bold inline-block text-lg">Wellnash</span>
          </a>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#features" className="transition-colors hover:text-primary">Features</a>
            <a href="#how-it-works" className="transition-colors hover:text-primary">How It Works</a>
            <a href="#pricing" className="transition-colors hover:text-primary">Pricing</a>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full" asChild>
              <Link to="/login?signup=true">
                Sign Up <MoveRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 md:py-32 bg-gradient-to-br from-muted/50 via-background to-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-purple-600">Personalized</span> Fitness Journey Starts Here.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Wellnash crafts unique workout plans tailored to your goals, injuries, and available gym equipment. Experience the future of fitness, intelligently designed for you.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base px-8 py-6 group" asChild>
                <Link to="/login">
                  Get Your Smart Workout Plan
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-base px-8 py-6 group" asChild>
                <Link to="#features">
                  Learn More
                  <MoveRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Choose Wellnash?</h2>
            <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
              Discover intelligent features designed to optimize your training and keep you motivated.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: Smart Workout Recommendation */}
              <div className="bg-card p-6 rounded-xl shadow-soft transition-all hover:shadow-soft-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Bot className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Smart Workout Engine</h3>
                <p className="text-muted-foreground text-sm">
                  AI-powered recommendations based on your duration, past performance, injury considerations, and gym equipment.
                </p>
              </div>
              {/* Feature 2: Gym Integration */}
              <div className="bg-card p-6 rounded-xl shadow-soft transition-all hover:shadow-soft-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gym Integration & Equipment</h3>
                <p className="text-muted-foreground text-sm">
                  Find nearby gyms and see equipment availability. Workouts adapt to what's available to you.
                </p>
              </div>
              {/* Feature 3: User Experience / 3D Body Model */}
              <div className="bg-card p-6 rounded-xl shadow-soft transition-all hover:shadow-soft-lg">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-lg mb-4">
                  <Users className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Engaging User Experience</h3>
                <p className="text-muted-foreground text-sm">
                  Interactive 3D body model for volume tracking, gamification, and progress analytics to keep you on track.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* 3D Body Model Teaser Section Placeholder */}
        <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="md:w-1/2">
                <div className="aspect-video bg-gradient-to-tr from-primary/20 to-purple-600/20 rounded-xl shadow-lg flex items-center justify-center">
                  {/* Placeholder for 3D model visual or animation */}
                  <BarChart className="w-24 h-24 text-primary opacity-50" />
                </div>
              </div>
              <div className="md:w-1/2">
                <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-2 inline-block">Visualize Your Progress</span>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Track Your Volume with Our 3D Body Model</h2>
                <p className="text-muted-foreground mb-6">
                  See exactly which muscle groups you've worked and how your efforts are shaping your physique. Our interactive 3D model provides a clear, motivating view of your weekly training volume.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <ShieldCheck className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Identify muscle imbalances and adjust your plan.</span>
                  </li>
                  <li className="flex items-center">
                    <Target className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Stay motivated by seeing tangible results.</span>
                  </li>
                  <li className="flex items-center">
                    <Bot className="w-5 h-5 text-primary mr-3 flex-shrink-0" />
                    <span>Understand how your workouts impact your body.</span>
                  </li>
                </ul>
                <Button variant="outline" className="rounded-full group" asChild>
                  <Link to="/login">
                    Explore the Body Model <MoveRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final Call to Action Section Placeholder */}
        <section id="pricing" className="py-20 md:py-32 bg-background">
          <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Fitness?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-10">
              Join Wellnash today and get workout plans that are as unique as you are.
              It's time to train smarter, not just harder.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full text-base px-10 py-6 group" asChild>
              <Link to="/login">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border/40">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Wellnash. All rights reserved.</p>
          <p className="mt-1">
            <a href="/privacy" className="hover:text-primary">Privacy Policy</a> | <a href="/terms" className="hover:text-primary">Terms of Service</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
