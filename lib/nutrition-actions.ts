'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from './user-actions';
import type { Food, MealEntry, DailyNutrition, NutritionGoals, ApiResponse, PaginatedResponse } from './types';

// Environment variables
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const FOODS_COLLECTION_ID = process.env.NEXT_PUBLIC_FOODS_COLLECTION_ID || 'foods';
const MEAL_ENTRIES_COLLECTION_ID = process.env.NEXT_PUBLIC_MEAL_ENTRIES_COLLECTION_ID || 'meal_entries';
const DAILY_NUTRITION_COLLECTION_ID = process.env.NEXT_PUBLIC_DAILY_NUTRITION_COLLECTION_ID || 'daily_nutrition';

const parseStringify = (obj: any) => JSON.parse(JSON.stringify(obj));

/**
 * Food Database Actions
 */
export async function createFood(food: Omit<Food, '$id' | 'isVerified' | 'createdAt'>): Promise<ApiResponse<Food>> {
  try {
    const { database } = await createAdminClient();

    const newFood = await database.createDocument(
      DATABASE_ID,
      FOODS_COLLECTION_ID,
      ID.unique(),
      {
        ...food,
        isVerified: false,
        createdAt: new Date().toISOString(),
      }
    );

    return { success: true, data: parseStringify(newFood) };
  } catch (error) {
    console.error('Error creating food:', error);
    return { success: false, error: 'Failed to create food entry' };
  }
}

export async function searchFoods(params: {
  query?: string;
  category?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<Food>> {
  try {
    const { database } = await createAdminClient();
    const queries = [];

    if (params.query) {
      queries.push(Query.search('name', params.query));
    }
    if (params.category) {
      queries.push(Query.equal('category', [params.category]));
    }

    queries.push(Query.orderDesc('isVerified'));
    queries.push(Query.orderAsc('name'));

    if (params.limit) {
      queries.push(Query.limit(params.limit));
    }
    if (params.offset) {
      queries.push(Query.offset(params.offset));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      FOODS_COLLECTION_ID,
      queries
    );

    return {
      items: parseStringify(result.documents),
      total: result.total,
      page: Math.floor((params.offset || 0) / (params.limit || 25)) + 1,
      pageSize: params.limit || 25,
      hasMore: (params.offset || 0) + (params.limit || 25) < result.total
    };
  } catch (error) {
    console.error('Error searching foods:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
      hasMore: false
    };
  }
}

export async function getFoodById(foodId: string): Promise<Food | null> {
  try {
    const { database } = await createAdminClient();

    const food = await database.getDocument(
      DATABASE_ID,
      FOODS_COLLECTION_ID,
      foodId
    );

    return parseStringify(food);
  } catch (error) {
    console.error('Error fetching food:', error);
    return null;
  }
}

/**
 * Meal Entry Actions
 */
export async function addMealEntry(entry: Omit<MealEntry, '$id' | 'userId'>): Promise<ApiResponse<MealEntry>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const newEntry = await database.createDocument(
      DATABASE_ID,
      MEAL_ENTRIES_COLLECTION_ID,
      ID.unique(),
      {
        ...entry,
        userId: user.userId,
      }
    );

    // Update daily nutrition
    await updateDailyNutrition(entry.date);

    revalidatePath('/nutrition');
    return { success: true, data: parseStringify(newEntry) };
  } catch (error) {
    console.error('Error adding meal entry:', error);
    return { success: false, error: 'Failed to add meal entry' };
  }
}

export async function getMealEntriesForDate(date: string, userId?: string): Promise<MealEntry[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();

    const entries = await database.listDocuments(
      DATABASE_ID,
      MEAL_ENTRIES_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.equal('date', [date]),
        Query.orderAsc('time')
      ]
    );

    return parseStringify(entries.documents);
  } catch (error) {
    console.error('Error fetching meal entries:', error);
    return [];
  }
}

export async function updateMealEntry(
  entryId: string,
  updates: Partial<Omit<MealEntry, '$id' | 'userId'>>
): Promise<ApiResponse<MealEntry>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedEntry = await database.updateDocument(
      DATABASE_ID,
      MEAL_ENTRIES_COLLECTION_ID,
      entryId,
      updates
    );

    // Update daily nutrition if date changed
    if (updates.date) {
      await updateDailyNutrition(updates.date);
    }

    revalidatePath('/nutrition');
    return { success: true, data: parseStringify(updatedEntry) };
  } catch (error) {
    console.error('Error updating meal entry:', error);
    return { success: false, error: 'Failed to update meal entry' };
  }
}

export async function deleteMealEntry(entryId: string): Promise<ApiResponse<void>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    // Get the entry to know which date to update
    const entry = await database.getDocument(DATABASE_ID, MEAL_ENTRIES_COLLECTION_ID, entryId);
    
    await database.deleteDocument(
      DATABASE_ID,
      MEAL_ENTRIES_COLLECTION_ID,
      entryId
    );

    // Update daily nutrition
    await updateDailyNutrition(entry.date);

    revalidatePath('/nutrition');
    return { success: true };
  } catch (error) {
    console.error('Error deleting meal entry:', error);
    return { success: false, error: 'Failed to delete meal entry' };
  }
}

/**
 * Daily Nutrition Actions
 */
async function updateDailyNutrition(date: string): Promise<void> {
  try {
    const user = await getLoggedInUser();
    if (!user) return;

    const { database } = await createAdminClient();

    // Get all meal entries for the date
    const entries = await getMealEntriesForDate(date);

    // Calculate totals
    let totalCalories = 0;
    const totalMacros = {
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      sugar: 0
    };

    // Group by meal type
    const meals = {
      breakfast: [] as MealEntry[],
      lunch: [] as MealEntry[],
      dinner: [] as MealEntry[],
      snack: [] as MealEntry[]
    };

    entries.forEach(entry => {
      totalCalories += entry.calories;
      totalMacros.protein += entry.macros.protein;
      totalMacros.carbs += entry.macros.carbs;
      totalMacros.fat += entry.macros.fat;
      totalMacros.fiber += entry.macros.fiber;
      totalMacros.sugar += entry.macros.sugar;

      meals[entry.mealType].push(entry);
    });

    // Check if daily nutrition record exists
    const existingRecord = await database.listDocuments(
      DATABASE_ID,
      DAILY_NUTRITION_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.equal('date', [date])
      ]
    );

    const nutritionData = {
      userId: user.userId,
      date,
      totalCalories,
      totalMacros,
      meals,
      water: 0, // This would need to be tracked separately
      goals: {
        calories: 2000, // Default goals, should be user-configurable
        protein: 150,
        carbs: 250,
        fat: 67
      }
    };

    if (existingRecord.documents.length > 0) {
      // Update existing record
      await database.updateDocument(
        DATABASE_ID,
        DAILY_NUTRITION_COLLECTION_ID,
        existingRecord.documents[0].$id,
        nutritionData
      );
    } else {
      // Create new record
      await database.createDocument(
        DATABASE_ID,
        DAILY_NUTRITION_COLLECTION_ID,
        ID.unique(),
        nutritionData
      );
    }
  } catch (error) {
    console.error('Error updating daily nutrition:', error);
  }
}

export async function getDailyNutrition(date: string, userId?: string): Promise<DailyNutrition | null> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return null;
    }

    const { database } = await createAdminClient();

    const result = await database.listDocuments(
      DATABASE_ID,
      DAILY_NUTRITION_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.equal('date', [date])
      ]
    );

    if (result.documents.length === 0) {
      // Create empty daily nutrition record
      await updateDailyNutrition(date);
      return getDailyNutrition(date, user.userId);
    }

    return parseStringify(result.documents[0]);
  } catch (error) {
    console.error('Error fetching daily nutrition:', error);
    return null;
  }
}

export async function updateWaterIntake(date: string, amount: number): Promise<ApiResponse<DailyNutrition>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const existingRecord = await database.listDocuments(
      DATABASE_ID,
      DAILY_NUTRITION_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.equal('date', [date])
      ]
    );

    let updatedRecord;

    if (existingRecord.documents.length > 0) {
      const currentWater = existingRecord.documents[0].water || 0;
      updatedRecord = await database.updateDocument(
        DATABASE_ID,
        DAILY_NUTRITION_COLLECTION_ID,
        existingRecord.documents[0].$id,
        { water: currentWater + amount }
      );
    } else {
      // Create new record with water intake
      await updateDailyNutrition(date);
      const newRecord = await getDailyNutrition(date);
      if (newRecord) {
        updatedRecord = await database.updateDocument(
          DATABASE_ID,
          DAILY_NUTRITION_COLLECTION_ID,
          newRecord.$id!,
          { water: amount }
        );
      }
    }

    revalidatePath('/nutrition');
    return { success: true, data: parseStringify(updatedRecord) };
  } catch (error) {
    console.error('Error updating water intake:', error);
    return { success: false, error: 'Failed to update water intake' };
  }
}

export async function updateNutritionGoals(goals: NutritionGoals): Promise<ApiResponse<void>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // This would typically update user preferences
    // For now, we'll store it as part of daily nutrition goals
    // In a real app, this would be stored in a user preferences collection

    revalidatePath('/nutrition');
    return { success: true };
  } catch (error) {
    console.error('Error updating nutrition goals:', error);
    return { success: false, error: 'Failed to update nutrition goals' };
  }
}

/**
 * Common Food Database (Prebuilt)
 */
export const COMMON_FOODS: Omit<Food, '$id' | 'createdAt'>[] = [
  {
    name: "Chicken Breast",
    brand: "Generic",
    category: "Protein",
    servingSize: "100g",
    caloriesPerServing: 165,
    macros: {
      protein: 31,
      carbs: 0,
      fat: 3.6,
      fiber: 0,
      sugar: 0
    },
    micronutrients: {
      sodium: 74,
      potassium: 256,
      vitamin_b6: 0.5,
      niacin: 8.5
    },
    isVerified: true
  },
  {
    name: "Brown Rice",
    brand: "Generic",
    category: "Carbohydrates",
    servingSize: "100g cooked",
    caloriesPerServing: 112,
    macros: {
      protein: 2.6,
      carbs: 22,
      fat: 0.9,
      fiber: 1.8,
      sugar: 0.4
    },
    micronutrients: {
      manganese: 0.9,
      selenium: 9.8,
      magnesium: 43
    },
    isVerified: true
  },
  {
    name: "Broccoli",
    brand: "Generic",
    category: "Vegetables",
    servingSize: "100g",
    caloriesPerServing: 34,
    macros: {
      protein: 2.8,
      carbs: 7,
      fat: 0.4,
      fiber: 2.6,
      sugar: 1.5
    },
    micronutrients: {
      vitamin_c: 89.2,
      vitamin_k: 101.6,
      folate: 63
    },
    isVerified: true
  },
  {
    name: "Banana",
    brand: "Generic",
    category: "Fruits",
    servingSize: "1 medium (118g)",
    caloriesPerServing: 105,
    macros: {
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
      fiber: 3.1,
      sugar: 14.4
    },
    micronutrients: {
      potassium: 422,
      vitamin_b6: 0.4,
      vitamin_c: 10.3
    },
    isVerified: true
  },
  {
    name: "Oats",
    brand: "Generic",
    category: "Carbohydrates",
    servingSize: "100g dry",
    caloriesPerServing: 389,
    macros: {
      protein: 16.9,
      carbs: 66.3,
      fat: 6.9,
      fiber: 10.6,
      sugar: 0.99
    },
    micronutrients: {
      manganese: 4.9,
      phosphorus: 523,
      magnesium: 177
    },
    isVerified: true
  },
  {
    name: "Greek Yogurt",
    brand: "Generic",
    category: "Dairy",
    servingSize: "100g",
    caloriesPerServing: 59,
    macros: {
      protein: 10,
      carbs: 3.6,
      fat: 0.4,
      fiber: 0,
      sugar: 3.6
    },
    micronutrients: {
      calcium: 110,
      vitamin_b12: 0.5,
      riboflavin: 0.3
    },
    isVerified: true
  }
];

export async function seedCommonFoods(): Promise<void> {
  try {
    const { database } = await createAdminClient();
    const now = new Date().toISOString();

    for (const food of COMMON_FOODS) {
      try {
        await database.createDocument(
          DATABASE_ID,
          FOODS_COLLECTION_ID,
          ID.unique(),
          {
            ...food,
            createdAt: now,
          }
        );
      } catch (error) {
        console.log('Food might already exist, skipping...');
      }
    }
  } catch (error) {
    console.error('Error seeding common foods:', error);
  }
}