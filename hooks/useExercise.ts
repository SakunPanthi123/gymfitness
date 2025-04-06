"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  addExercise, 
  getUserExercises, 
  getExerciseById, 
  deleteExercise,
  updateExercise
} from "@/lib/exercise-actions";
import { Exercise } from "@/lib/exercise-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Keys for exercise queries
const EXERCISES_QUERY_KEY = "exercises";
const EXERCISE_DETAIL_KEY = "exercise";

// Hook to manage exercises
export function useExercise() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Get all exercises for the current user
  const { data: exercises, isLoading: isLoadingExercises, error: exercisesError } = useQuery({
    queryKey: [EXERCISES_QUERY_KEY],
    queryFn: async () => {
      const data = await getUserExercises();
      return data;
    },
  });

  // Get a specific exercise by ID
  const getExercise = (exerciseId: string) => {
    return useQuery({
      queryKey: [EXERCISE_DETAIL_KEY, exerciseId],
      queryFn: async () => {
        const data = await getExerciseById(exerciseId);
        return data;
      },
    });
  };

  // Add new exercise mutation
  const { mutate: addNewExercise, isPending: isAddingExercise } = useMutation({
    mutationFn: addExercise,
    onSuccess: () => {
      // Invalidate the exercises query to refetch the updated list
      queryClient.invalidateQueries({ queryKey: [EXERCISES_QUERY_KEY] });
      toast("Exercise added successfully");
      router.push("/exercises");
    },
    onError: (error) => {
      console.error("Error adding exercise:", error);
      toast("Failed to add exercise");
    },
  });

  // Update exercise mutation
  const { mutate: updateExistingExercise, isPending: isUpdatingExercise } = useMutation({
    mutationFn: updateExercise,
    onSuccess: (data) => {
      // Invalidate the exercises query and the specific exercise detail
      queryClient.invalidateQueries({ queryKey: [EXERCISES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [EXERCISE_DETAIL_KEY, data.$id] });
      toast("Exercise updated successfully");
      router.push(`/exercises/${data.$id}`);
    },
    onError: (error) => {
      console.error("Error updating exercise:", error);
      toast("Failed to update exercise");
    },
  });

  // Delete exercise mutation
  const { mutate: removeExercise, isPending: isDeletingExercise } = useMutation({
    mutationFn: deleteExercise,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [EXERCISES_QUERY_KEY] });
      toast("Exercise deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting exercise:", error);
      toast("Failed to delete exercise");
    },
  });

  return {
    exercises,
    isLoadingExercises,
    exercisesError,
    getExercise,
    addNewExercise,
    isAddingExercise,
    updateExistingExercise,
    isUpdatingExercise,
    removeExercise,
    isDeletingExercise,
  };
}