"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { 
  ProgressEntry, 
  PersonalRecord, 
  Goal, 
  Achievement, 
  DashboardStats, 
  WeeklyProgress, 
  ApiResponse 
} from "@/lib/types";
import {
  addProgressEntry,
  getUserProgressEntries,
  updateProgressEntry,
  deleteProgressEntry,
  addPersonalRecord,
  getUserPersonalRecords,
  createGoal,
  getUserGoals,
  updateGoalProgress,
  updateGoal,
  getUserAchievements,
  markAchievementAsShared,
  getDashboardStats,
  getWeeklyProgress
} from "@/lib/progress-actions";

// Query keys
const PROGRESS_ENTRIES_KEY = "progress-entries";
const PERSONAL_RECORDS_KEY = "personal-records";
const GOALS_KEY = "goals";
const ACHIEVEMENTS_KEY = "achievements";
const DASHBOARD_STATS_KEY = "dashboard-stats";
const WEEKLY_PROGRESS_KEY = "weekly-progress";

/**
 * Hook for managing progress entries
 */
export function useProgressEntries(userId?: string, type?: string) {
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading } = useQuery({
    queryKey: [PROGRESS_ENTRIES_KEY, userId, type],
    queryFn: () => getUserProgressEntries(userId, type),
  });

  const { mutate: addEntry, isPending: isAdding } = useMutation({
    mutationFn: addProgressEntry,
    onSuccess: (result: ApiResponse<ProgressEntry>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [PROGRESS_ENTRIES_KEY] });
        queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        toast.success("Progress entry added successfully!");
      } else {
        toast.error(result.error || "Failed to add progress entry");
      }
    },
    onError: (error) => {
      console.error("Add progress entry error:", error);
      toast.error("Failed to add progress entry");
    },
  });

  const { mutate: updateEntry, isPending: isUpdating } = useMutation({
    mutationFn: ({ entryId, updates }: { entryId: string; updates: Partial<ProgressEntry> }) =>
      updateProgressEntry(entryId, updates),
    onSuccess: (result: ApiResponse<ProgressEntry>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [PROGRESS_ENTRIES_KEY] });
        toast.success("Progress entry updated successfully!");
      } else {
        toast.error(result.error || "Failed to update progress entry");
      }
    },
    onError: (error) => {
      console.error("Update progress entry error:", error);
      toast.error("Failed to update progress entry");
    },
  });

  const { mutate: deleteEntry, isPending: isDeleting } = useMutation({
    mutationFn: deleteProgressEntry,
    onSuccess: (result: ApiResponse<void>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [PROGRESS_ENTRIES_KEY] });
        toast.success("Progress entry deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete progress entry");
      }
    },
    onError: (error) => {
      console.error("Delete progress entry error:", error);
      toast.error("Failed to delete progress entry");
    },
  });

  return {
    entries,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    isAdding,
    isUpdating,
    isDeleting,
  };
}

/**
 * Hook for managing personal records
 */
export function usePersonalRecords(userId?: string) {
  const queryClient = useQueryClient();

  const { data: records = [], isLoading } = useQuery({
    queryKey: [PERSONAL_RECORDS_KEY, userId],
    queryFn: () => getUserPersonalRecords(userId),
  });

  const { mutate: addRecord, isPending: isAdding } = useMutation({
    mutationFn: addPersonalRecord,
    onSuccess: (result: ApiResponse<PersonalRecord>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [PERSONAL_RECORDS_KEY] });
        queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_KEY] });
        toast.success("Personal record added successfully!");
      } else {
        toast.error(result.error || "Failed to add personal record");
      }
    },
    onError: (error) => {
      console.error("Add personal record error:", error);
      toast.error("Failed to add personal record");
    },
  });

  return {
    records,
    isLoading,
    addRecord,
    isAdding,
  };
}

/**
 * Hook for managing goals
 */
export function useGoals(userId?: string, status?: string) {
  const queryClient = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: [GOALS_KEY, userId, status],
    queryFn: () => getUserGoals(userId, status),
  });

  const { mutate: createNewGoal, isPending: isCreating } = useMutation({
    mutationFn: createGoal,
    onSuccess: (result: ApiResponse<Goal>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
        toast.success("Goal created successfully!");
      } else {
        toast.error(result.error || "Failed to create goal");
      }
    },
    onError: (error) => {
      console.error("Create goal error:", error);
      toast.error("Failed to create goal");
    },
  });

  const { mutate: updateProgress, isPending: isUpdatingProgress } = useMutation({
    mutationFn: ({ goalId, newCurrent }: { goalId: string; newCurrent: number }) =>
      updateGoalProgress(goalId, newCurrent),
    onSuccess: (result: ApiResponse<Goal>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
        queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
        queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_KEY] });
        toast.success("Goal progress updated successfully!");
      } else {
        toast.error(result.error || "Failed to update goal progress");
      }
    },
    onError: (error) => {
      console.error("Update goal progress error:", error);
      toast.error("Failed to update goal progress");
    },
  });

  const { mutate: updateGoalData, isPending: isUpdating } = useMutation({
    mutationFn: ({ goalId, updates }: { goalId: string; updates: Partial<Goal> }) =>
      updateGoal(goalId, updates),
    onSuccess: (result: ApiResponse<Goal>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
        toast.success("Goal updated successfully!");
      } else {
        toast.error(result.error || "Failed to update goal");
      }
    },
    onError: (error) => {
      console.error("Update goal error:", error);
      toast.error("Failed to update goal");
    },
  });

  return {
    goals,
    isLoading,
    createNewGoal,
    updateProgress,
    updateGoalData,
    isCreating,
    isUpdatingProgress,
    isUpdating,
  };
}

/**
 * Hook for managing achievements
 */
export function useAchievements(userId?: string) {
  const queryClient = useQueryClient();

  const { data: achievements = [], isLoading } = useQuery({
    queryKey: [ACHIEVEMENTS_KEY, userId],
    queryFn: () => getUserAchievements(userId),
  });

  const { mutate: shareAchievement, isPending: isSharing } = useMutation({
    mutationFn: markAchievementAsShared,
    onSuccess: (result: ApiResponse<Achievement>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_KEY] });
        toast.success("Achievement shared successfully!");
      } else {
        toast.error(result.error || "Failed to share achievement");
      }
    },
    onError: (error) => {
      console.error("Share achievement error:", error);
      toast.error("Failed to share achievement");
    },
  });

  return {
    achievements,
    isLoading,
    shareAchievement,
    isSharing,
  };
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats(userId?: string) {
  const { data: stats, isLoading } = useQuery({
    queryKey: [DASHBOARD_STATS_KEY, userId],
    queryFn: () => getDashboardStats(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    stats,
    isLoading,
  };
}

/**
 * Hook for weekly progress
 */
export function useWeeklyProgress(userId?: string) {
  const { data: weeklyProgress = [], isLoading } = useQuery({
    queryKey: [WEEKLY_PROGRESS_KEY, userId],
    queryFn: () => getWeeklyProgress(userId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    weeklyProgress,
    isLoading,
  };
}

/**
 * Hook for progress tracking utilities
 */
export function useProgressTracking() {
  const queryClient = useQueryClient();

  // Helper function to refresh all progress-related data
  const refreshAllProgress = () => {
    queryClient.invalidateQueries({ queryKey: [PROGRESS_ENTRIES_KEY] });
    queryClient.invalidateQueries({ queryKey: [PERSONAL_RECORDS_KEY] });
    queryClient.invalidateQueries({ queryKey: [GOALS_KEY] });
    queryClient.invalidateQueries({ queryKey: [ACHIEVEMENTS_KEY] });
    queryClient.invalidateQueries({ queryKey: [DASHBOARD_STATS_KEY] });
    queryClient.invalidateQueries({ queryKey: [WEEKLY_PROGRESS_KEY] });
  };

  // Helper function to calculate progress percentage
  const calculateProgressPercentage = (current: number, target: number): number => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  // Helper function to get progress trend
  const getProgressTrend = (entries: ProgressEntry[], type: string): 'up' | 'down' | 'stable' => {
    const filteredEntries = entries.filter(entry => entry.type === type).slice(0, 2);
    if (filteredEntries.length < 2) return 'stable';
    
    const [latest, previous] = filteredEntries;
    if (latest.value > previous.value) return 'up';
    if (latest.value < previous.value) return 'down';
    return 'stable';
  };

  // Helper function to format progress value with unit
  const formatProgressValue = (value: number, unit: string): string => {
    if (unit === 'kg' || unit === 'lbs') {
      return `${value.toFixed(1)} ${unit}`;
    }
    if (unit === 'cm' || unit === 'inches') {
      return `${value.toFixed(1)} ${unit}`;
    }
    if (unit === '%') {
      return `${value.toFixed(1)}%`;
    }
    return `${value} ${unit}`;
  };

  return {
    refreshAllProgress,
    calculateProgressPercentage,
    getProgressTrend,
    formatProgressValue,
  };
}