"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Star,
  Play,
  Dumbbell,
  Target,
  Calendar
} from "lucide-react";
import { useWorkoutRoutines, useWorkoutPlanner } from "@/hooks/useWorkout";

export default function WorkoutsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const { userRoutines, publicRoutines, isLoadingUserRoutines, isLoadingPublicRoutines } = useWorkoutRoutines();
  const { todaysWorkouts, isLoading: isLoadingToday } = useWorkoutPlanner();

  const categories = ["All", "Strength", "Cardio", "Flexibility", "HIIT", "Endurance"];
  const difficulties = ["All", "Beginner", "Intermediate", "Advanced"];

  const filteredPublicRoutines = publicRoutines.filter(routine => {
    const matchesSearch = routine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         routine.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || 
                           routine.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesDifficulty = !selectedDifficulty || selectedDifficulty === "All" || 
                             routine.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Workouts</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Discover routines, track sessions, and plan your fitness journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Button className="h-20" asChild>
            <Link href="/workouts/new">
              <div className="flex flex-col items-center">
                <Plus className="h-6 w-6 mb-2" />
                <span>Start Workout</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link href="/workouts/routines/new">
              <div className="flex flex-col items-center">
                <Dumbbell className="h-6 w-6 mb-2" />
                <span>Create Routine</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link href="/planner">
              <div className="flex flex-col items-center">
                <Calendar className="h-6 w-6 mb-2" />
                <span>Plan Week</span>
              </div>
            </Link>
          </Button>
          <Button variant="outline" className="h-20" asChild>
            <Link href="/progress">
              <div className="flex flex-col items-center">
                <Target className="h-6 w-6 mb-2" />
                <span>Track Progress</span>
              </div>
            </Link>
          </Button>
        </div>

        {/* Today's Workouts */}
        {todaysWorkouts.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Today's Schedule
              </CardTitle>
              <CardDescription>Your planned workouts for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {todaysWorkouts.map((session) => (
                  <div key={session.$id} className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div>
                      <h3 className="font-medium">{session.routineName || 'Custom Workout'}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(session.startTime).toLocaleTimeString('en-US', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                    <Button size="sm" asChild>
                      <Link href={`/workouts/session/${session.$id}`}>
                        <Play className="h-4 w-4 mr-2" />
                        Start
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Routines */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>My Routines</CardTitle>
            <CardDescription>Your custom workout routines</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingUserRoutines ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : userRoutines.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {userRoutines.map((routine) => (
                  <Card key={routine.$id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{routine.name}</CardTitle>
                        <Badge className={getDifficultyColor(routine.difficulty)}>
                          {routine.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {routine.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {routine.duration} min
                        </span>
                        <span className="flex items-center">
                          <Dumbbell className="h-4 w-4 mr-1" />
                          {routine.exercises.length} exercises
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/workouts/routine/${routine.$id}/start`}>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/workouts/routine/${routine.$id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No routines yet</h3>
                <p className="text-gray-500 mb-4">Create your first workout routine to get started</p>
                <Button asChild>
                  <Link href="/workouts/routines/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Routine
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browse Public Routines */}
        <Card>
          <CardHeader>
            <CardTitle>Discover Routines</CardTitle>
            <CardDescription>Explore popular workout routines from the community</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search routines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat === "All" ? "" : cat}>{cat}</option>
                  ))}
                </select>
                <select 
                  value={selectedDifficulty} 
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white dark:bg-gray-800 dark:border-gray-600"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff === "All" ? "" : diff}>{diff}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Routines Grid */}
            {isLoadingPublicRoutines ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredPublicRoutines.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPublicRoutines.map((routine) => (
                  <Card key={routine.$id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{routine.name}</CardTitle>
                        <Badge className={getDifficultyColor(routine.difficulty)}>
                          {routine.difficulty}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {routine.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {routine.duration} min
                        </span>
                        <span className="flex items-center">
                          <Dumbbell className="h-4 w-4 mr-1" />
                          {routine.exercises.length} exercises
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1" />
                          {routine.likes} likes
                        </span>
                        <span className="flex items-center">
                          <Users className="h-4 w-4 mr-1" />
                          {routine.usageCount} used
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1" asChild>
                          <Link href={`/workouts/routine/${routine.$id}/start`}>
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/workouts/routine/${routine.$id}`}>
                            View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No routines found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}