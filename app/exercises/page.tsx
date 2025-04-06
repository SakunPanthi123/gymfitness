"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Activity, ChevronLeft, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/hooks/useUser";
import { useExercise } from "@/hooks/useExercise";
import { texerciseResponse } from "@/lib/exercise-actions";

export default function ExercisesPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { exercises, isLoadingExercises, removeExercise } = useExercise();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  // Function to format date string to more readable format
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Function to get appropriate badge color based on exercise type
  const getExerciseTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      cardio: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      strength: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      flexibility: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      balance: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      sports: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  if (isLoading || isLoadingExercises) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading exercises...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 ">
        <div className="sticky top-[93px] z-10 bg-gray-50 dark:bg-gray-900 p-2">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Exercises</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage and track your workout history</p>
          </div>
          <Button asChild>
            <Link href="/add-exercise" className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Exercise
            </Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search exercises..."
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="flex items-center">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        </div>
        {/* Exercises List */}
        <div className="m-5 space-y-4">
          {exercises && exercises.length > 0 ? (
            exercises.map((exercise: texerciseResponse) => (
              <Card key={exercise.$id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row md:items-center justify-between p-6">
                    <div className="flex-grow mb-4 md:mb-0">
                      <div className="flex items-center justify-between md:justify-start">
                        <h3 className="text-xl font-semibold">{exercise.name}</h3>
                        <span className={`ml-4 text-xs font-medium px-2.5 py-0.5 rounded-full ${getExerciseTypeColor(exercise.type)}`}>
                          {exercise.type}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex flex-wrap gap-4">
                        <span>Date: {formatDate(exercise.date)}</span>
                        <span>Duration: {exercise.duration} min</span>
                        <span>Calories: {exercise.caloriesBurned}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="default" asChild>
                        <Link href={`/exercises/${exercise.$id}`}>
                          View Details
                        </Link>
                      </Button>
                      <Button variant="destructive" onClick={() => removeExercise(exercise.$id || "")}>
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-10 flex flex-col items-center justify-center text-center">
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                  <Activity className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No exercises found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Start tracking your fitness journey by adding your first workout.
                </p>
                <Button asChild>
                  <Link href="/add-exercise">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Exercise
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}