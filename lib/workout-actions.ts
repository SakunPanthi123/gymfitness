'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from './user-actions';
import type { WorkoutRoutine, WorkoutSession, ExerciseTemplate, ApiResponse, PaginatedResponse } from './types';

// Environment variables
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const WORKOUT_ROUTINES_COLLECTION_ID = process.env.NEXT_PUBLIC_WORKOUT_ROUTINES_COLLECTION_ID || 'workout_routines';
const WORKOUT_SESSIONS_COLLECTION_ID = process.env.NEXT_PUBLIC_WORKOUT_SESSIONS_COLLECTION_ID || 'workout_sessions';
const EXERCISE_TEMPLATES_COLLECTION_ID = process.env.NEXT_PUBLIC_EXERCISE_TEMPLATES_COLLECTION_ID || 'exercise_templates';

const parseStringify = (obj: any) => JSON.parse(JSON.stringify(obj));

/**
 * Exercise Templates Actions
 */
export async function createExerciseTemplate(template: Omit<ExerciseTemplate, '$id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<ExerciseTemplate>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();
    const now = new Date().toISOString();

    const newTemplate = await database.createDocument(
      DATABASE_ID,
      EXERCISE_TEMPLATES_COLLECTION_ID,
      ID.unique(),
      {
        ...template,
        createdAt: now,
        updatedAt: now,
      }
    );

    revalidatePath('/exercises');
    return { success: true, data: parseStringify(newTemplate) };
  } catch (error) {
    console.error('Error creating exercise template:', error);
    return { success: false, error: 'Failed to create exercise template' };
  }
}

export async function getExerciseTemplates(params?: {
  category?: string;
  muscleGroup?: string;
  difficulty?: string;
  equipment?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<ExerciseTemplate>> {
  try {
    const { database } = await createAdminClient();
    const queries = [];

    if (params?.category) {
      queries.push(Query.equal('category', [params.category]));
    }
    if (params?.difficulty) {
      queries.push(Query.equal('difficulty', [params.difficulty]));
    }
    if (params?.muscleGroup) {
      queries.push(Query.contains('muscleGroups', [params.muscleGroup]));
    }
    if (params?.equipment) {
      queries.push(Query.contains('equipment', [params.equipment]));
    }

    queries.push(Query.orderDesc('createdAt'));
    
    if (params?.limit) {
      queries.push(Query.limit(params.limit));
    }
    if (params?.offset) {
      queries.push(Query.offset(params.offset));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      EXERCISE_TEMPLATES_COLLECTION_ID,
      queries
    );

    return {
      items: parseStringify(result.documents),
      total: result.total,
      page: Math.floor((params?.offset || 0) / (params?.limit || 25)) + 1,
      pageSize: params?.limit || 25,
      hasMore: (params?.offset || 0) + (params?.limit || 25) < result.total
    };
  } catch (error) {
    console.error('Error fetching exercise templates:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
      hasMore: false
    };
  }
}

/**
 * Workout Routines Actions
 */
export async function createWorkoutRoutine(routine: Omit<WorkoutRoutine, '$id' | 'creatorId' | 'likes' | 'usageCount' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<WorkoutRoutine>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();
    const now = new Date().toISOString();

    const newRoutine = await database.createDocument(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      ID.unique(),
      {
        ...routine,
        creatorId: user.userId,
        likes: 0,
        usageCount: 0,
        createdAt: now,
        updatedAt: now,
      }
    );

    revalidatePath('/workouts');
    return { success: true, data: parseStringify(newRoutine) };
  } catch (error) {
    console.error('Error creating workout routine:', error);
    return { success: false, error: 'Failed to create workout routine' };
  }
}

export async function getUserWorkoutRoutines(userId?: string): Promise<WorkoutRoutine[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();

    const routines = await database.listDocuments(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      [
        Query.equal('creatorId', [user.userId]),
        Query.orderDesc('updatedAt')
      ]
    );

    return parseStringify(routines.documents);
  } catch (error) {
    console.error('Error fetching user workout routines:', error);
    return [];
  }
}

export async function getPublicWorkoutRoutines(params?: {
  category?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}): Promise<PaginatedResponse<WorkoutRoutine>> {
  try {
    const { database } = await createAdminClient();
    const queries = [Query.equal('isPublic', [true])];

    if (params?.category) {
      queries.push(Query.equal('category', [params.category]));
    }
    if (params?.difficulty) {
      queries.push(Query.equal('difficulty', [params.difficulty]));
    }

    queries.push(Query.orderDesc('likes'));
    
    if (params?.limit) {
      queries.push(Query.limit(params.limit));
    }
    if (params?.offset) {
      queries.push(Query.offset(params.offset));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      queries
    );

    return {
      items: parseStringify(result.documents),
      total: result.total,
      page: Math.floor((params?.offset || 0) / (params?.limit || 25)) + 1,
      pageSize: params?.limit || 25,
      hasMore: (params?.offset || 0) + (params?.limit || 25) < result.total
    };
  } catch (error) {
    console.error('Error fetching public workout routines:', error);
    return {
      items: [],
      total: 0,
      page: 1,
      pageSize: 25,
      hasMore: false
    };
  }
}

export async function getWorkoutRoutineById(routineId: string): Promise<WorkoutRoutine | null> {
  try {
    const { database } = await createAdminClient();

    const routine = await database.getDocument(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      routineId
    );

    return parseStringify(routine);
  } catch (error) {
    console.error('Error fetching workout routine:', error);
    return null;
  }
}

export async function updateWorkoutRoutine(
  routineId: string,
  updates: Partial<Omit<WorkoutRoutine, '$id' | 'creatorId' | 'createdAt'>>
): Promise<ApiResponse<WorkoutRoutine>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedRoutine = await database.updateDocument(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      routineId,
      {
        ...updates,
        updatedAt: new Date().toISOString(),
      }
    );

    revalidatePath('/workouts');
    revalidatePath(`/workouts/${routineId}`);
    return { success: true, data: parseStringify(updatedRoutine) };
  } catch (error) {
    console.error('Error updating workout routine:', error);
    return { success: false, error: 'Failed to update workout routine' };
  }
}

export async function deleteWorkoutRoutine(routineId: string): Promise<ApiResponse<void>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID,
      WORKOUT_ROUTINES_COLLECTION_ID,
      routineId
    );

    revalidatePath('/workouts');
    return { success: true };
  } catch (error) {
    console.error('Error deleting workout routine:', error);
    return { success: false, error: 'Failed to delete workout routine' };
  }
}

/**
 * Workout Sessions Actions
 */
export async function createWorkoutSession(session: Omit<WorkoutSession, '$id' | 'userId'>): Promise<ApiResponse<WorkoutSession>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const newSession = await database.createDocument(
      DATABASE_ID,
      WORKOUT_SESSIONS_COLLECTION_ID,
      ID.unique(),
      {
        ...session,
        userId: user.userId,
      }
    );

    // Update routine usage count if associated with a routine
    if (session.routineId) {
      try {
        const routine = await getWorkoutRoutineById(session.routineId);
        if (routine) {
          await updateWorkoutRoutine(session.routineId, {
            usageCount: (routine.usageCount || 0) + 1
          });
        }
      } catch (error) {
        console.log('Could not update routine usage count:', error);
      }
    }

    revalidatePath('/dashboard');
    revalidatePath('/workouts');
    return { success: true, data: parseStringify(newSession) };
  } catch (error) {
    console.error('Error creating workout session:', error);
    return { success: false, error: 'Failed to create workout session' };
  }
}

export async function getUserWorkoutSessions(userId?: string, limit?: number): Promise<WorkoutSession[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();
    const queries = [
      Query.equal('userId', [user.userId]),
      Query.orderDesc('startTime')
    ];

    if (limit) {
      queries.push(Query.limit(limit));
    }

    const sessions = await database.listDocuments(
      DATABASE_ID,
      WORKOUT_SESSIONS_COLLECTION_ID,
      queries
    );

    return parseStringify(sessions.documents);
  } catch (error) {
    console.error('Error fetching user workout sessions:', error);
    return [];
  }
}

export async function updateWorkoutSession(
  sessionId: string,
  updates: Partial<Omit<WorkoutSession, '$id' | 'userId'>>
): Promise<ApiResponse<WorkoutSession>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedSession = await database.updateDocument(
      DATABASE_ID,
      WORKOUT_SESSIONS_COLLECTION_ID,
      sessionId,
      updates
    );

    revalidatePath('/dashboard');
    revalidatePath('/workouts');
    return { success: true, data: parseStringify(updatedSession) };
  } catch (error) {
    console.error('Error updating workout session:', error);
    return { success: false, error: 'Failed to update workout session' };
  }
}

export async function getWorkoutSessionById(sessionId: string): Promise<WorkoutSession | null> {
  try {
    const { database } = await createAdminClient();

    const session = await database.getDocument(
      DATABASE_ID,
      WORKOUT_SESSIONS_COLLECTION_ID,
      sessionId
    );

    return parseStringify(session);
  } catch (error) {
    console.error('Error fetching workout session:', error);
    return null;
  }
}

/**
 * Prebuilt Routines Data
 */
export const PREBUILT_ROUTINES: Omit<WorkoutRoutine, '$id' | 'creatorId' | 'likes' | 'usageCount' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: "Full Body Beginner",
    description: "A comprehensive full-body workout perfect for beginners starting their fitness journey.",
    difficulty: "beginner",
    duration: 45,
    category: "strength",
    goals: ["build muscle", "increase strength", "improve endurance"],
    exercises: [
      {
        exerciseId: "push_up",
        exerciseName: "Push-ups",
        sets: 3,
        reps: 8,
        restTime: 60,
        order: 1
      },
      {
        exerciseId: "squat",
        exerciseName: "Bodyweight Squats",
        sets: 3,
        reps: 12,
        restTime: 60,
        order: 2
      },
      {
        exerciseId: "plank",
        exerciseName: "Plank",
        sets: 3,
        duration: 30,
        restTime: 60,
        order: 3
      }
    ],
    isPublic: true,
    tags: ["beginner", "full-body", "bodyweight", "strength"]
  },
  {
    name: "HIIT Cardio Blast",
    description: "High-intensity interval training to burn calories and improve cardiovascular fitness.",
    difficulty: "intermediate",
    duration: 25,
    category: "cardio",
    goals: ["lose weight", "improve cardio", "burn calories"],
    exercises: [
      {
        exerciseId: "jumping_jacks",
        exerciseName: "Jumping Jacks",
        sets: 4,
        duration: 45,
        restTime: 15,
        order: 1
      },
      {
        exerciseId: "burpees",
        exerciseName: "Burpees",
        sets: 4,
        reps: 10,
        restTime: 15,
        order: 2
      },
      {
        exerciseId: "mountain_climbers",
        exerciseName: "Mountain Climbers",
        sets: 4,
        duration: 30,
        restTime: 15,
        order: 3
      }
    ],
    isPublic: true,
    tags: ["HIIT", "cardio", "fat-loss", "intermediate"]
  }
];

export async function seedPrebuiltRoutines(): Promise<void> {
  try {
    const { database } = await createAdminClient();
    const now = new Date().toISOString();

    for (const routine of PREBUILT_ROUTINES) {
      try {
        await database.createDocument(
          DATABASE_ID,
          WORKOUT_ROUTINES_COLLECTION_ID,
          ID.unique(),
          {
            ...routine,
            creatorId: 'system',
            likes: 0,
            usageCount: 0,
            createdAt: now,
            updatedAt: now,
          }
        );
      } catch (error) {
        console.log('Routine might already exist, skipping...');
      }
    }
  } catch (error) {
    console.error('Error seeding prebuilt routines:', error);
  }
}