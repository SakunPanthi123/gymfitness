"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { 
  Activity, 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Flame, 
  Target, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  ArrowRight 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/useUser";
import { useExercise } from "@/hooks/useExercise";

export default function ExerciseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const { user, isLoading } = useUser();
  const { getExercise, removeExercise } = useExercise();
  
  // Fetch the specific exercise data
  const { data: exercise, isLoading: isLoadingExercise } = getExercise(id);
  console.log(exercise)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin");
    }
  }, [isLoading, user, router]);

  // Function to format date string to more readable format
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "MMMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Handle delete exercise
  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this exercise?")) {
      removeExercise(id);
      router.push("/exercises");
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
    return colors[type?.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  };

  if (isLoading || isLoadingExercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading exercise details...</p>
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="bg-yellow-100 dark:bg-yellow-900 rounded-full p-4 inline-block mb-4">
              <Activity className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Exercise Not Found</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              The exercise you're looking for doesn't exist or has been deleted.
            </p>
            <Button asChild>
              <Link href="/exercises" className="flex items-center justify-center">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Exercises
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/exercises" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to All Exercises
          </Link>
        </Button>

        <Card className="max-w-3xl mx-auto">
          <CardHeader className="pb-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <span className={`mb-2 inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${getExerciseTypeColor(exercise.type)}`}>
                  {exercise.type}
                </span>
                <CardTitle className="text-3xl font-bold">{exercise.name}</CardTitle>
                <CardDescription className="mt-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {formatDate(exercise.date)}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                  <Link href={`/exercises/${exercise.$id}/edit`}>
                <Button variant="outline" className="flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                  </Link>
                <Button variant="destructive" className="flex items-center" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="mt-6 space-y-8">
            {/* Summary Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-primary/10">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="text-2xl font-bold">{exercise.duration} min</p>
                  </div>
                  <Clock className="h-8 w-8 text-primary/70" />
                </CardContent>
              </Card>
              
              <Card className="bg-orange-500/10">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Calories</p>
                    <p className="text-2xl font-bold">{exercise.caloriesBurned}</p>
                  </div>
                  <Flame className="h-8 w-8 text-orange-500/70" />
                </CardContent>
              </Card>
              
              <Card className="bg-blue-500/10 sm:col-span-2 md:col-span-1">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Exercise Type</p>
                    <p className="text-2xl font-bold capitalize">{exercise.type}</p>
                  </div>
                  <Activity className="h-8 w-8 text-blue-500/70" />
                </CardContent>
              </Card>
            </div>
            
            {/* Goals Section */}
            {exercise.goals && exercise.goals.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Exercise Goals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {exercise.goals.map((goal: string, index: number) => (
                    <Badge key={index} variant="outline" className="py-1">
                      {goal}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Notes Section */}
            {exercise.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <Card className="bg-muted/30 border">
                  <CardContent className="p-4 whitespace-pre-wrap">
                    {exercise.notes}
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4 border-t">
            <Button variant="outline" asChild>
              <Link href="/add-exercise" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Add Another Exercise
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" className="flex items-center">
                Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}