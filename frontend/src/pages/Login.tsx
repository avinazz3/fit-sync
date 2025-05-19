import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Target, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "../app/auth/supabase-auth";

export default function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get("signup") === "true";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nextPath = searchParams.get("next") || "/dashboard";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      let response;
      if (isSignUp) {
        response = await signUp(email, password);
        console.log('Signup response:', response);
      } else {
        response = await signIn(email, password);
        console.log('Sign in response:', response);
      }

      if (response.error) {
        setError(response.error.message);
        setIsLoading(false);
      } else {
        // Force a small delay to ensure authentication state is updated
        setTimeout(() => {
          // Explicitly use dashboard path to ensure proper navigation
          const redirectPath = nextPath === '/' ? '/dashboard' : nextPath;
          console.log('Login successful, redirecting to:', redirectPath);
          navigate(redirectPath, { replace: true });
        }, 500);
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  if (isLoading && !error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-6 bg-card shadow-lg rounded-xl">
        <div className="flex justify-center mb-6">
          <Target className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-muted-foreground text-center mb-6">
          {isSignUp 
            ? "Sign up to get personalized workout plans" 
            : "Sign in to access your fitness dashboard"}
        </p>

        {error && (
          <div className="bg-destructive/20 text-destructive p-3 rounded-md flex items-center mb-6">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your.email@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : (
              <>{isSignUp ? "Sign up" : "Sign in"}</>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold" 
                onClick={() => navigate("/login")}>
                Sign in
              </Button>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-semibold" 
                onClick={() => navigate("/login?signup=true")}>
                Create an account
              </Button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};