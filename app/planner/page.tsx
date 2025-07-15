"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, Dumbbell, Plus, Target } from "lucide-react";

export default function PlannerPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workout Planner</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Plan your workouts and schedule your fitness routine
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Calendar className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Workout Planner Coming Soon!</CardTitle>
            <CardDescription className="text-lg">
              We're building an amazing drag-and-drop workout planner with calendar integration
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Weekly and monthly calendar views</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Dumbbell className="h-4 w-4" />
                <span>Drag-and-drop routine scheduling</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Smart scheduling with rest day recommendations</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Target className="h-4 w-4" />
                <span>Goal-based workout suggestions</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-500">
                In the meantime, you can still create and start workouts:
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/workouts">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Browse Workouts
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/workouts/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Start Workout
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}