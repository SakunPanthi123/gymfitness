'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from './appwrite';
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from './user-actions';

/**
 * Exercise data interface
 */
export interface Exercise {
  // default document attribute
  $id?: string;
  // main attributes
  userId: string;
  name: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
  notes?: string;
  goals?: string[];
}

export type texerciseResponse = {
  // default document attribute
  $id?: string;
  // main attributes
  userId: string;
  name: string;
  type: string;
  duration: string;
  caloriesBurned: string;
  date: string;
  notes?: string;
  goals?: string[];
}

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const EXERCISES_COLLECTION_ID = process.env.NEXT_PUBLIC_EXERCISES_COLLECTION_ID || '';

if (!DATABASE_ID || !EXERCISES_COLLECTION_ID) {
  console.error('Missing database environment variables for exercises collection');
}

/**
 * Parse and stringify object to ensure it's a plain object
 */
const parseStringify = async (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Add a new exercise to the database
 */
export async function addExercise({
  name,
  type,
  duration,
  caloriesBurned,
  date,
  notes,
  goals
}: Omit<Exercise, 'userId'>) {
  try {
    // Get the logged in user
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { database } = await createAdminClient();

    // Create the exercise record
    const exercise = await database.createDocument(
      DATABASE_ID,
      EXERCISES_COLLECTION_ID,
      ID.unique(),
      {
        userId: user.userId,
        name,
        type,
        duration: duration.toString(),
        caloriesBurned: caloriesBurned.toString(),
        date,
        notes,
        goals,
      }
    );

    // Revalidate the pages that display exercises
    revalidatePath('/exercises');
    revalidatePath('/');
    
    return parseStringify(exercise);
  } catch (error) {
    console.error('Error adding exercise:', error);
    throw error;
  }
}

/**
 * Get exercises for the current user
 */
export async function getUserExercises() {
  try {
    // Get the logged in user
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { database } = await createAdminClient();

    // Get exercises for the current user, ordered by date descending
    const exercises = await database.listDocuments(
      DATABASE_ID,
      EXERCISES_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.orderDesc('date')
      ]
    );

    return parseStringify(exercises.documents);
  } catch (error) {
    console.error('Error getting user exercises:', error);
    return [];
  }
}

/**
 * Get a specific exercise by ID
 */
export async function getExerciseById(exerciseId: string) {
  try {
    const { database } = await createAdminClient();

    const exercise = await database.getDocument(
      DATABASE_ID,
      EXERCISES_COLLECTION_ID,
      exerciseId
    );
    
    return parseStringify(exercise);
  } catch (error) {
    console.error('Error getting exercise by ID:', error);
    return null;
  }
}

/**
 * Delete an exercise by ID
 */
export async function deleteExercise(exerciseId: string) {
  try {
    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID,
      EXERCISES_COLLECTION_ID,
      exerciseId
    );

    // Revalidate the pages that display exercises
    revalidatePath('/exercises');
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting exercise:', error);
    return { success: false };
  }
}

/**
 * Update an existing exercise
 */
export async function updateExercise({
  exerciseId,
  name,
  type,
  duration,
  caloriesBurned,
  date,
  notes,
  goals
}: {
  exerciseId: string;
} & Omit<Exercise, 'userId' | '$id'>) {
  try {
    // Get the logged in user
    const user = await getLoggedInUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { database } = await createAdminClient();

    // Update the exercise record
    const exercise = await database.updateDocument(
      DATABASE_ID,
      EXERCISES_COLLECTION_ID,
      exerciseId,
      {
        name,
        type,
        duration: duration.toString(),
        caloriesBurned: caloriesBurned.toString(),
        date,
        notes,
        goals,
      }
    );

    // Revalidate the pages that display exercises
    revalidatePath('/exercises');
    revalidatePath(`/exercises/${exerciseId}`);
    revalidatePath('/');
    
    return parseStringify(exercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    throw error;
  }
}