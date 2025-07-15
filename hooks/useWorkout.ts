"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { WorkoutRoutine, WorkoutSession, ExerciseTemplate, ApiResponse } from "@/lib/types";
import {
  createWorkoutRoutine,
  getUserWorkoutRoutines,
  getPublicWorkoutRoutines,
  getWorkoutRoutineById,
  updateWorkoutRoutine,
  deleteWorkoutRoutine,
  createWorkoutSession,
  getUserWorkoutSessions,
  updateWorkoutSession,
  getWorkoutSessionById,
  createExerciseTemplate,
  getExerciseTemplates
} from "@/lib/workout-actions";

// Query keys
const WORKOUT_ROUTINES_KEY = "workout-routines";
const WORKOUT_SESSIONS_KEY = "workout-sessions";
const EXERCISE_TEMPLATES_KEY = "exercise-templates";

/**
 * Hook for managing workout routines
 */
export function useWorkoutRoutines(userId?: string) {
  const queryClient = useQueryClient();

  // Get user's workout routines
  const { data: userRoutines = [], isLoading: isLoadingUserRoutines } = useQuery({
    queryKey: [WORKOUT_ROUTINES_KEY, "user", userId],
    queryFn: () => getUserWorkoutRoutines(userId),
  });

  // Get public workout routines
  const { data: publicRoutines, isLoading: isLoadingPublicRoutines } = useQuery({
    queryKey: [WORKOUT_ROUTINES_KEY, "public"],
    queryFn: () => getPublicWorkoutRoutines({ limit: 50 }),
  });

  // Create workout routine mutation
  const { mutate: createRoutine, isPending: isCreating } = useMutation({
    mutationFn: createWorkoutRoutine,
    onSuccess: (result: ApiResponse<WorkoutRoutine>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_ROUTINES_KEY] });
        toast.success("Workout routine created successfully!");
      } else {
        toast.error(result.error || "Failed to create workout routine");
      }
    },
    onError: (error) => {
      console.error("Create routine error:", error);
      toast.error("Failed to create workout routine");
    },
  });

  // Update workout routine mutation
  const { mutate: updateRoutine, isPending: isUpdating } = useMutation({
    mutationFn: ({ routineId, updates }: { routineId: string; updates: Partial<WorkoutRoutine> }) =>
      updateWorkoutRoutine(routineId, updates),
    onSuccess: (result: ApiResponse<WorkoutRoutine>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_ROUTINES_KEY] });
        toast.success("Workout routine updated successfully!");
      } else {
        toast.error(result.error || "Failed to update workout routine");
      }
    },
    onError: (error) => {
      console.error("Update routine error:", error);
      toast.error("Failed to update workout routine");
    },
  });

  // Delete workout routine mutation
  const { mutate: deleteRoutine, isPending: isDeleting } = useMutation({
    mutationFn: deleteWorkoutRoutine,
    onSuccess: (result: ApiResponse<void>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_ROUTINES_KEY] });
        toast.success("Workout routine deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete workout routine");
      }
    },
    onError: (error) => {
      console.error("Delete routine error:", error);
      toast.error("Failed to delete workout routine");
    },
  });

  return {
    userRoutines,
    publicRoutines: publicRoutines?.items || [],
    isLoadingUserRoutines,
    isLoadingPublicRoutines,
    createRoutine,
    updateRoutine,
    deleteRoutine,
    isCreating,
    isUpdating,
    isDeleting,
  };
}

/**
 * Hook for managing individual workout routine
 */
export function useWorkoutRoutine(routineId: string) {
  const queryClient = useQueryClient();

  const { data: routine, isLoading } = useQuery({
    queryKey: [WORKOUT_ROUTINES_KEY, routineId],
    queryFn: () => getWorkoutRoutineById(routineId),
    enabled: !!routineId,
  });

  const { mutate: updateRoutine, isPending: isUpdating } = useMutation({
    mutationFn: (updates: Partial<WorkoutRoutine>) => updateWorkoutRoutine(routineId, updates),
    onSuccess: (result: ApiResponse<WorkoutRoutine>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_ROUTINES_KEY, routineId] });
        queryClient.invalidateQueries({ queryKey: [WORKOUT_ROUTINES_KEY] });
        toast.success("Workout routine updated successfully!");
      } else {
        toast.error(result.error || "Failed to update workout routine");
      }
    },
    onError: (error) => {
      console.error("Update routine error:", error);
      toast.error("Failed to update workout routine");
    },
  });

  return {
    routine,
    isLoading,
    updateRoutine,
    isUpdating,
  };
}

/**
 * Hook for managing workout sessions
 */
export function useWorkoutSessions(userId?: string) {
  const queryClient = useQueryClient();

  // Get user's workout sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: [WORKOUT_SESSIONS_KEY, "user", userId],
    queryFn: () => getUserWorkoutSessions(userId),
  });

  // Create workout session mutation
  const { mutate: createSession, isPending: isCreating } = useMutation({
    mutationFn: createWorkoutSession,
    onSuccess: (result: ApiResponse<WorkoutSession>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_SESSIONS_KEY] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Workout session created successfully!");
      } else {
        toast.error(result.error || "Failed to create workout session");
      }
    },
    onError: (error) => {
      console.error("Create session error:", error);
      toast.error("Failed to create workout session");
    },
  });

  // Update workout session mutation
  const { mutate: updateSession, isPending: isUpdating } = useMutation({
    mutationFn: ({ sessionId, updates }: { sessionId: string; updates: Partial<WorkoutSession> }) =>
      updateWorkoutSession(sessionId, updates),
    onSuccess: (result: ApiResponse<WorkoutSession>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_SESSIONS_KEY] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Workout session updated successfully!");
      } else {
        toast.error(result.error || "Failed to update workout session");
      }
    },
    onError: (error) => {
      console.error("Update session error:", error);
      toast.error("Failed to update workout session");
    },
  });

  return {
    sessions,
    isLoading,
    createSession,
    updateSession,
    isCreating,
    isUpdating,
  };
}

/**
 * Hook for managing individual workout session
 */
export function useWorkoutSession(sessionId: string) {
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useQuery({
    queryKey: [WORKOUT_SESSIONS_KEY, sessionId],
    queryFn: () => getWorkoutSessionById(sessionId),
    enabled: !!sessionId,
  });

  const { mutate: updateSession, isPending: isUpdating } = useMutation({
    mutationFn: (updates: Partial<WorkoutSession>) => updateWorkoutSession(sessionId, updates),
    onSuccess: (result: ApiResponse<WorkoutSession>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_SESSIONS_KEY, sessionId] });
        queryClient.invalidateQueries({ queryKey: [WORKOUT_SESSIONS_KEY] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        toast.success("Workout session updated successfully!");
      } else {
        toast.error(result.error || "Failed to update workout session");
      }
    },
    onError: (error) => {
      console.error("Update session error:", error);
      toast.error("Failed to update workout session");
    },
  });

  return {
    session,
    isLoading,
    updateSession,
    isUpdating,
  };
}

/**
 * Hook for managing exercise templates
 */
export function useExerciseTemplates() {
  const queryClient = useQueryClient();

  // Get exercise templates
  const { data: templatesData, isLoading } = useQuery({
    queryKey: [EXERCISE_TEMPLATES_KEY],
    queryFn: () => getExerciseTemplates({ limit: 100 }),
  });

  const templates = templatesData?.items || [];

  // Create exercise template mutation
  const { mutate: createTemplate, isPending: isCreating } = useMutation({
    mutationFn: createExerciseTemplate,
    onSuccess: (result: ApiResponse<ExerciseTemplate>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [EXERCISE_TEMPLATES_KEY] });
        toast.success("Exercise template created successfully!");
      } else {
        toast.error(result.error || "Failed to create exercise template");
      }
    },
    onError: (error) => {
      console.error("Create template error:", error);
      toast.error("Failed to create exercise template");
    },
  });

  // Search templates by category or muscle group
  const searchTemplates = (params: {
    category?: string;
    muscleGroup?: string;
    difficulty?: string;
    equipment?: string;
  }) => {
    return getExerciseTemplates(params);
  };

  return {
    templates,
    isLoading,
    createTemplate,
    isCreating,
    searchTemplates,
  };
}

/**
 * Hook for workout planning
 */
export function useWorkoutPlanner() {
  const queryClient = useQueryClient();

  // Get today's planned workouts
  const { data: todaysWorkouts = [], isLoading } = useQuery({
    queryKey: [WORKOUT_SESSIONS_KEY, "today"],
    queryFn: async () => {
      const today = new Date().toISOString().split('T')[0];
      const sessions = await getUserWorkoutSessions();
      return sessions.filter(session => session.date === today);
    },
  });

  // Schedule a workout
  const { mutate: scheduleWorkout, isPending: isScheduling } = useMutation({
    mutationFn: ({ routineId, date, timeSlot }: { routineId: string; date: string; timeSlot: string }) => {
      return createWorkoutSession({
        routineId,
        startTime: `${date}T${timeSlot}:00.000Z`,
        status: 'planned',
        exercises: [],
        date
      });
    },
    onSuccess: (result: ApiResponse<WorkoutSession>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_SESSIONS_KEY] });
        toast.success("Workout scheduled successfully!");
      } else {
        toast.error(result.error || "Failed to schedule workout");
      }
    },
    onError: (error) => {
      console.error("Schedule workout error:", error);
      toast.error("Failed to schedule workout");
    },
  });

  return {
    todaysWorkouts,
    isLoading,
    scheduleWorkout,
    isScheduling,
  };
}