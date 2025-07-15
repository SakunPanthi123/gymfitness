"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { 
  Food, 
  MealEntry, 
  DailyNutrition, 
  NutritionGoals, 
  ApiResponse, 
  PaginatedResponse 
} from "@/lib/types";
import {
  createFood,
  searchFoods,
  getFoodById,
  addMealEntry,
  getMealEntriesForDate,
  updateMealEntry,
  deleteMealEntry,
  getDailyNutrition,
  updateWaterIntake,
  updateNutritionGoals
} from "@/lib/nutrition-actions";

// Query keys
const FOODS_KEY = "foods";
const MEAL_ENTRIES_KEY = "meal-entries";
const DAILY_NUTRITION_KEY = "daily-nutrition";

/**
 * Hook for managing food database
 */
export function useFoods() {
  const queryClient = useQueryClient();

  // Search foods with query parameters
  const searchFoodsQuery = (params: {
    query?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) => {
    return useQuery({
      queryKey: [FOODS_KEY, "search", params],
      queryFn: () => searchFoods(params),
      enabled: !!(params.query || params.category),
    });
  };

  // Get food by ID
  const getFoodQuery = (foodId: string) => {
    return useQuery({
      queryKey: [FOODS_KEY, foodId],
      queryFn: () => getFoodById(foodId),
      enabled: !!foodId,
    });
  };

  // Create food mutation
  const { mutate: createNewFood, isPending: isCreating } = useMutation({
    mutationFn: createFood,
    onSuccess: (result: ApiResponse<Food>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [FOODS_KEY] });
        toast.success("Food added to database successfully!");
      } else {
        toast.error(result.error || "Failed to add food to database");
      }
    },
    onError: (error) => {
      console.error("Create food error:", error);
      toast.error("Failed to add food to database");
    },
  });

  return {
    searchFoodsQuery,
    getFoodQuery,
    createNewFood,
    isCreating,
  };
}

/**
 * Hook for managing meal entries
 */
export function useMealEntries(date?: string, userId?: string) {
  const queryClient = useQueryClient();

  // Get meal entries for a specific date
  const { data: entries = [], isLoading } = useQuery({
    queryKey: [MEAL_ENTRIES_KEY, date, userId],
    queryFn: () => getMealEntriesForDate(date || new Date().toISOString().split('T')[0], userId),
    enabled: !!date,
  });

  // Add meal entry mutation
  const { mutate: addEntry, isPending: isAdding } = useMutation({
    mutationFn: addMealEntry,
    onSuccess: (result: ApiResponse<MealEntry>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [MEAL_ENTRIES_KEY] });
        queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY] });
        toast.success("Meal entry added successfully!");
      } else {
        toast.error(result.error || "Failed to add meal entry");
      }
    },
    onError: (error) => {
      console.error("Add meal entry error:", error);
      toast.error("Failed to add meal entry");
    },
  });

  // Update meal entry mutation
  const { mutate: updateEntry, isPending: isUpdating } = useMutation({
    mutationFn: ({ entryId, updates }: { entryId: string; updates: Partial<MealEntry> }) =>
      updateMealEntry(entryId, updates),
    onSuccess: (result: ApiResponse<MealEntry>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [MEAL_ENTRIES_KEY] });
        queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY] });
        toast.success("Meal entry updated successfully!");
      } else {
        toast.error(result.error || "Failed to update meal entry");
      }
    },
    onError: (error) => {
      console.error("Update meal entry error:", error);
      toast.error("Failed to update meal entry");
    },
  });

  // Delete meal entry mutation
  const { mutate: deleteEntry, isPending: isDeleting } = useMutation({
    mutationFn: deleteMealEntry,
    onSuccess: (result: ApiResponse<void>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [MEAL_ENTRIES_KEY] });
        queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY] });
        toast.success("Meal entry deleted successfully!");
      } else {
        toast.error(result.error || "Failed to delete meal entry");
      }
    },
    onError: (error) => {
      console.error("Delete meal entry error:", error);
      toast.error("Failed to delete meal entry");
    },
  });

  // Group entries by meal type
  const entriesByMealType = {
    breakfast: entries.filter(entry => entry.mealType === 'breakfast'),
    lunch: entries.filter(entry => entry.mealType === 'lunch'),
    dinner: entries.filter(entry => entry.mealType === 'dinner'),
    snack: entries.filter(entry => entry.mealType === 'snack'),
  };

  return {
    entries,
    entriesByMealType,
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
 * Hook for managing daily nutrition
 */
export function useDailyNutrition(date?: string, userId?: string) {
  const queryClient = useQueryClient();
  const targetDate = date || new Date().toISOString().split('T')[0];

  // Get daily nutrition data
  const { data: dailyNutrition, isLoading } = useQuery({
    queryKey: [DAILY_NUTRITION_KEY, targetDate, userId],
    queryFn: () => getDailyNutrition(targetDate, userId),
  });

  // Update water intake mutation
  const { mutate: addWater, isPending: isUpdatingWater } = useMutation({
    mutationFn: ({ amount }: { amount: number }) => updateWaterIntake(targetDate, amount),
    onSuccess: (result: ApiResponse<DailyNutrition>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY, targetDate] });
        toast.success("Water intake updated!");
      } else {
        toast.error(result.error || "Failed to update water intake");
      }
    },
    onError: (error) => {
      console.error("Update water error:", error);
      toast.error("Failed to update water intake");
    },
  });

  // Update nutrition goals mutation
  const { mutate: updateGoals, isPending: isUpdatingGoals } = useMutation({
    mutationFn: updateNutritionGoals,
    onSuccess: (result: ApiResponse<void>) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY] });
        toast.success("Nutrition goals updated successfully!");
      } else {
        toast.error(result.error || "Failed to update nutrition goals");
      }
    },
    onError: (error) => {
      console.error("Update nutrition goals error:", error);
      toast.error("Failed to update nutrition goals");
    },
  });

  // Calculate nutrition progress percentages
  const getNutritionProgress = () => {
    if (!dailyNutrition) return null;

    const { totalCalories, totalMacros, goals } = dailyNutrition;

    return {
      calories: Math.round((totalCalories / goals.calories) * 100),
      protein: Math.round((totalMacros.protein / goals.protein) * 100),
      carbs: Math.round((totalMacros.carbs / goals.carbs) * 100),
      fat: Math.round((totalMacros.fat / goals.fat) * 100),
    };
  };

  // Get remaining calories/macros
  const getRemainingNutrition = () => {
    if (!dailyNutrition) return null;

    const { totalCalories, totalMacros, goals } = dailyNutrition;

    return {
      calories: Math.max(0, goals.calories - totalCalories),
      protein: Math.max(0, goals.protein - totalMacros.protein),
      carbs: Math.max(0, goals.carbs - totalMacros.carbs),
      fat: Math.max(0, goals.fat - totalMacros.fat),
    };
  };

  return {
    dailyNutrition,
    isLoading,
    addWater,
    updateGoals,
    isUpdatingWater,
    isUpdatingGoals,
    getNutritionProgress,
    getRemainingNutrition,
  };
}

/**
 * Hook for nutrition tracking utilities
 */
export function useNutritionTracking() {
  const queryClient = useQueryClient();

  // Helper function to calculate macros from food and quantity
  const calculateMacros = (food: Food, quantity: number) => {
    const multiplier = quantity; // Assuming quantity is in servings
    
    return {
      calories: Math.round(food.caloriesPerServing * multiplier),
      macros: {
        protein: Math.round(food.macros.protein * multiplier * 10) / 10,
        carbs: Math.round(food.macros.carbs * multiplier * 10) / 10,
        fat: Math.round(food.macros.fat * multiplier * 10) / 10,
        fiber: Math.round(food.macros.fiber * multiplier * 10) / 10,
        sugar: Math.round(food.macros.sugar * multiplier * 10) / 10,
      }
    };
  };

  // Helper function to format macro percentage
  const getMacroPercentage = (macroCalories: number, totalCalories: number): number => {
    if (totalCalories === 0) return 0;
    return Math.round((macroCalories / totalCalories) * 100);
  };

  // Helper function to convert macros to calories
  const macrosToCalories = (macros: { protein: number; carbs: number; fat: number }) => {
    return {
      protein: macros.protein * 4, // 4 calories per gram of protein
      carbs: macros.carbs * 4, // 4 calories per gram of carbs
      fat: macros.fat * 9, // 9 calories per gram of fat
    };
  };

  // Helper function to get macro distribution
  const getMacroDistribution = (macros: { protein: number; carbs: number; fat: number }) => {
    const calories = macrosToCalories(macros);
    const totalCalories = calories.protein + calories.carbs + calories.fat;

    if (totalCalories === 0) {
      return { protein: 0, carbs: 0, fat: 0 };
    }

    return {
      protein: getMacroPercentage(calories.protein, totalCalories),
      carbs: getMacroPercentage(calories.carbs, totalCalories),
      fat: getMacroPercentage(calories.fat, totalCalories),
    };
  };

  // Helper function to refresh nutrition data
  const refreshNutritionData = (date?: string) => {
    const targetDate = date || new Date().toISOString().split('T')[0];
    queryClient.invalidateQueries({ queryKey: [MEAL_ENTRIES_KEY, targetDate] });
    queryClient.invalidateQueries({ queryKey: [DAILY_NUTRITION_KEY, targetDate] });
  };

  // Helper function to get nutrition status color
  const getNutritionStatusColor = (current: number, target: number): 'success' | 'warning' | 'error' => {
    const percentage = (current / target) * 100;
    if (percentage >= 90 && percentage <= 110) return 'success';
    if (percentage >= 70 && percentage <= 130) return 'warning';
    return 'error';
  };

  // Helper function to format water intake
  const formatWaterIntake = (amount: number): string => {
    if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}L`;
    }
    return `${amount}ml`;
  };

  // Common food categories for filtering
  const foodCategories = [
    'Protein',
    'Carbohydrates',
    'Vegetables',
    'Fruits',
    'Dairy',
    'Fats & Oils',
    'Beverages',
    'Snacks',
    'Condiments',
    'Supplements'
  ];

  return {
    calculateMacros,
    getMacroPercentage,
    macrosToCalories,
    getMacroDistribution,
    refreshNutritionData,
    getNutritionStatusColor,
    formatWaterIntake,
    foodCategories,
  };
}

/**
 * Hook for food search with debouncing
 */
export function useFoodSearch() {
  const { searchFoodsQuery } = useFoods();

  // Helper function to search foods with debouncing
  const searchWithDebounce = (query: string, category?: string) => {
    return searchFoodsQuery({
      query: query.trim(),
      category,
      limit: 20,
    });
  };

  return {
    searchWithDebounce,
  };
}