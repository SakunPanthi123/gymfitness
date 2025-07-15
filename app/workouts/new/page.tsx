"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, Target, Dumbbell } from "lucide-react";
import Link from "next/link";
import { useWorkoutRoutines, useWorkoutSessions } from "@/hooks/useWorkout";
import { toast } from "sonner";
import type { WorkoutSession } from "@/lib/types";

export default function StartWorkoutPage() {
  const router = useRouter();
  const { userRoutines, isLoadingUserRoutines } = useWorkoutRoutines();
  const { createSession } = useWorkoutSessions();

  const [workoutType, setWorkoutType] = useState<'routine' | 'freestyle'>('routine');
  const [selectedRoutine, setSelectedRoutine] = useState('');
  const [customWorkoutName, setCustomWorkoutName] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const handleStartWorkout = async () => {
    if (workoutType === 'routine' && !selectedRoutine) {
      toast.error('Please select a routine');
      return;
    }

    if (workoutType === 'freestyle' && !customWorkoutName) {
      toast.error('Please enter a workout name');
      return;
    }

    setIsStarting(true);

    try {
      const routine = workoutType === 'routine' 
        ? userRoutines.find(r => r.$id === selectedRoutine)
        : null;

      const session: Omit<WorkoutSession, '$id' | 'userId'> = {
        routineId: workoutType === 'routine' ? selectedRoutine : undefined,
        routineName: workoutType === 'routine' ? routine?.name : undefined,
        startTime: new Date().toISOString(),
        exercises: routine?.exercises.map(exercise => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          sets: [],
          plannedSets: exercise.sets,
          plannedReps: exercise.reps,
          plannedWeight: exercise.weight,
          order: exercise.order
        })) || [],
        status: 'in-progress',
        totalDuration: 0,
        totalCalories: 0,
        notes: '',
        date: new Date().toISOString().split('T')[0]
      };

      createSession(session, {
        onSuccess: (result: any) => {
          if (result.success && result.data?.$id) {
            toast.success('Workout started!');
            router.push(`/workouts/session/${result.data.$id}`);
          }
        }
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast.error('Failed to start workout');
      setIsStarting(false);
    }
  };

  const selectedRoutineData = userRoutines.find(r => r.$id === selectedRoutine);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/workouts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workouts
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Start Workout</h1>
      </div>

      <div className="space-y-6">
        {/* Workout Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Workout Type</CardTitle>
            <CardDescription>
              Choose how you want to structure your workout
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setWorkoutType('routine')}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  workoutType === 'routine'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Target className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-medium">From Routine</h3>
                <p className="text-sm text-gray-500">Use a saved routine</p>
              </button>

              <button
                onClick={() => setWorkoutType('freestyle')}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  workoutType === 'freestyle'
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Dumbbell className="h-6 w-6 mx-auto mb-2" />
                <h3 className="font-medium">Freestyle</h3>
                <p className="text-sm text-gray-500">Create as you go</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Routine Selection */}
        {workoutType === 'routine' && (
          <Card>
            <CardHeader>
              <CardTitle>Select Routine</CardTitle>
              <CardDescription>
                Choose from your saved workout routines
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingUserRoutines ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading routines...</p>
                </div>
              ) : userRoutines.length === 0 ? (
                <div className="text-center py-8">
                  <Target className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-3">No routines found</p>
                  <Button size="sm" asChild>
                    <Link href="/workouts/routines/new">Create Your First Routine</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {userRoutines.map((routine) => (
                    <button
                      key={routine.$id}
                      onClick={() => setSelectedRoutine(routine.$id!)}
                      className={`w-full p-4 border-2 rounded-lg text-left transition-colors ${
                        selectedRoutine === routine.$id
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{routine.name}</h3>
                        <div className="flex gap-2">
                          <Badge variant="outline">{routine.difficulty}</Badge>
                          <Badge variant="outline">{routine.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{routine.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {routine.duration}min
                        </span>
                        <span className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {routine.exercises.length} exercises
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Freestyle Setup */}
        {workoutType === 'freestyle' && (
          <Card>
            <CardHeader>
              <CardTitle>Freestyle Workout</CardTitle>
              <CardDescription>
                Set up your custom workout session
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="workoutName">Workout Name</Label>
                <Input
                  id="workoutName"
                  placeholder="e.g., Morning Push Session, Leg Day"
                  value={customWorkoutName}
                  onChange={(e) => setCustomWorkoutName(e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500">
                You'll be able to add exercises during your workout session.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Routine Preview */}
        {workoutType === 'routine' && selectedRoutineData && (
          <Card>
            <CardHeader>
              <CardTitle>Workout Preview</CardTitle>
              <CardDescription>
                {selectedRoutineData.exercises.length} exercises • {selectedRoutineData.duration} minutes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedRoutineData.exercises.slice(0, 5).map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                      <h4 className="font-medium">{exercise.exerciseName}</h4>
                      <p className="text-sm text-gray-500">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && exercise.weight > 0 && ` @ ${exercise.weight}kg`}
                      </p>
                    </div>
                    {exercise.restTime && (
                      <Badge variant="outline" className="text-xs">
                        {exercise.restTime}s rest
                      </Badge>
                    )}
                  </div>
                ))}
                {selectedRoutineData.exercises.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">
                    +{selectedRoutineData.exercises.length - 5} more exercises
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Start Button */}
        <Card>
          <CardContent className="pt-6">
            <Button 
              onClick={handleStartWorkout}
              className="w-full"
              size="lg"
              disabled={
                isStarting || 
                (workoutType === 'routine' && !selectedRoutine) ||
                (workoutType === 'freestyle' && !customWorkoutName)
              }
            >
              <Play className="h-5 w-5 mr-2" />
              {isStarting ? 'Starting...' : 'Start Workout'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}