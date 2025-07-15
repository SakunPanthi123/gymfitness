"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Plus, Trash2, Clock, Target, Users } from "lucide-react";
import Link from "next/link";
import { useWorkoutRoutines } from "@/hooks/useWorkout";
import { toast } from "sonner";
import type { WorkoutRoutine, WorkoutExercise } from "@/lib/types";

const categories = [
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardiovascular' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'HIIT', label: 'HIIT' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'sports', label: 'Sports' },
  { value: 'recovery', label: 'Recovery' }
];

const difficulties = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const goalOptions = [
  'build muscle', 'lose weight', 'increase strength', 'improve endurance', 
  'improve flexibility', 'burn calories', 'build power', 'improve mobility'
];

export default function NewRoutinePage() {
  const router = useRouter();
  const { createRoutine } = useWorkoutRoutines();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    difficulty: '',
    duration: '',
    isPublic: false,
    tags: [] as string[],
    goals: [] as string[]
  });
  const [exercises, setExercises] = useState<Omit<WorkoutExercise, 'exerciseId'>[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addExercise = () => {
    setExercises(prev => [...prev, {
      exerciseName: '',
      sets: 3,
      reps: 10,
      weight: 0,
      duration: 0,
      restTime: 60,
      notes: '',
      order: prev.length + 1
    }]);
  };

  const updateExercise = (index: number, field: string, value: any) => {
    setExercises(prev => prev.map((exercise, i) => 
      i === index ? { ...exercise, [field]: value } : exercise
    ));
  };

  const removeExercise = (index: number) => {
    setExercises(prev => prev.filter((_, i) => i !== index)
      .map((exercise, i) => ({ ...exercise, order: i + 1 })));
  };

  const addGoal = (goal: string) => {
    if (!formData.goals.includes(goal)) {
      handleInputChange('goals', [...formData.goals, goal]);
    }
  };

  const removeGoal = (goal: string) => {
    handleInputChange('goals', formData.goals.filter(g => g !== goal));
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      handleInputChange('tags', [...formData.tags, tag]);
    }
  };

  const removeTag = (tag: string) => {
    handleInputChange('tags', formData.tags.filter(t => t !== tag));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.difficulty || exercises.length === 0) {
      toast.error('Please fill in all required fields and add at least one exercise');
      return;
    }

    setIsSubmitting(true);

    try {
      const routine: Omit<WorkoutRoutine, '$id' | 'creatorId' | 'likes' | 'usageCount' | 'createdAt' | 'updatedAt'> = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty as any,
        duration: parseInt(formData.duration) || 0,
        exercises: exercises.map((exercise, index) => ({
          ...exercise,
          exerciseId: `custom_${index}`, // For now, using custom IDs
        })),
        goals: formData.goals,
        isPublic: formData.isPublic,
        tags: formData.tags
      };

      createRoutine(routine, {
        onSuccess: () => {
          router.push('/workouts');
        }
      });
    } catch (error) {
      console.error('Error creating routine:', error);
      toast.error('Failed to create routine');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/workouts">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Workouts
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create Workout Routine</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Provide basic details about your workout routine
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Routine Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Upper Body Strength, Morning Cardio"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your workout routine, its purpose, and target audience..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty *</Label>
                <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.value} value={difficulty.value}>
                        {difficulty.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>
              Select the primary goals this routine helps achieve
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {goalOptions.map((goal) => (
                <Button
                  key={goal}
                  type="button"
                  variant={formData.goals.includes(goal) ? "default" : "outline"}
                  size="sm"
                  onClick={() => formData.goals.includes(goal) ? removeGoal(goal) : addGoal(goal)}
                >
                  {goal}
                </Button>
              ))}
            </div>
            {formData.goals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.goals.map((goal) => (
                  <Badge key={goal} variant="secondary" className="flex items-center gap-1">
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeGoal(goal)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exercises */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Exercises</span>
              <Button type="button" onClick={addExercise} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </CardTitle>
            <CardDescription>
              Add exercises to your routine with sets, reps, and rest periods
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {exercises.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No exercises added yet</p>
                <p className="text-sm">Click "Add Exercise" to start building your routine</p>
              </div>
            ) : (
              exercises.map((exercise, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Exercise {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExercise(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid gap-4">
                      <div>
                        <Label>Exercise Name *</Label>
                        <Input
                          placeholder="e.g., Push-ups, Squats, Bench Press"
                          value={exercise.exerciseName}
                          onChange={(e) => updateExercise(index, 'exerciseName', e.target.value)}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <Label>Sets</Label>
                          <Input
                            type="number"
                            min="1"
                            value={exercise.sets}
                            onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Reps</Label>
                          <Input
                            type="number"
                            min="0"
                            value={exercise.reps}
                            onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Weight (kg)</Label>
                          <Input
                            type="number"
                            step="0.5"
                            min="0"
                            value={exercise.weight}
                            onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value) || 0)}
                          />
                        </div>
                        <div>
                          <Label>Rest (sec)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={exercise.restTime}
                            onChange={(e) => updateExercise(index, 'restTime', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Notes (Optional)</Label>
                        <Input
                          placeholder="Form cues, modifications, tips..."
                          value={exercise.notes}
                          onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Privacy & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium">Share Routine</h3>
                <p className="text-sm text-gray-500">
                  Make this routine available for others to discover and use
                </p>
              </div>
              <Button
                type="button"
                variant={formData.isPublic ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('isPublic', !formData.isPublic)}
              >
                {formData.isPublic ? 'Public' : 'Private'}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting || exercises.length === 0}
              >
                {isSubmitting ? 'Creating...' : 'Create Routine'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/workouts">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}