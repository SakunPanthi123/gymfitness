'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { revalidatePath } from "next/cache";
import { getLoggedInUser } from './user-actions';
import type { ProgressEntry, PersonalRecord, Goal, Achievement, DashboardStats, WeeklyProgress, ApiResponse } from './types';

// Environment variables
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const PROGRESS_ENTRIES_COLLECTION_ID = process.env.NEXT_PUBLIC_PROGRESS_ENTRIES_COLLECTION_ID || 'progress_entries';
const PERSONAL_RECORDS_COLLECTION_ID = process.env.NEXT_PUBLIC_PERSONAL_RECORDS_COLLECTION_ID || 'personal_records';
const GOALS_COLLECTION_ID = process.env.NEXT_PUBLIC_GOALS_COLLECTION_ID || 'goals';
const ACHIEVEMENTS_COLLECTION_ID = process.env.NEXT_PUBLIC_ACHIEVEMENTS_COLLECTION_ID || 'achievements';

const parseStringify = (obj: any) => JSON.parse(JSON.stringify(obj));

/**
 * Progress Entry Actions
 */
export async function addProgressEntry(entry: Omit<ProgressEntry, '$id' | 'userId' | 'createdAt'>): Promise<ApiResponse<ProgressEntry>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const newEntry = await database.createDocument(
      DATABASE_ID,
      PROGRESS_ENTRIES_COLLECTION_ID,
      ID.unique(),
      {
        ...entry,
        userId: user.userId,
        createdAt: new Date().toISOString(),
      }
    );

    revalidatePath('/progress');
    revalidatePath('/dashboard');
    return { success: true, data: parseStringify(newEntry) };
  } catch (error) {
    console.error('Error adding progress entry:', error);
    return { success: false, error: 'Failed to add progress entry' };
  }
}

export async function getUserProgressEntries(
  userId?: string,
  type?: string,
  limit?: number
): Promise<ProgressEntry[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();
    const queries = [
      Query.equal('userId', [user.userId]),
      Query.orderDesc('date')
    ];

    if (type) {
      queries.push(Query.equal('type', [type]));
    }
    if (limit) {
      queries.push(Query.limit(limit));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      PROGRESS_ENTRIES_COLLECTION_ID,
      queries
    );

    return parseStringify(result.documents);
  } catch (error) {
    console.error('Error fetching progress entries:', error);
    return [];
  }
}

export async function updateProgressEntry(
  entryId: string,
  updates: Partial<Omit<ProgressEntry, '$id' | 'userId' | 'createdAt'>>
): Promise<ApiResponse<ProgressEntry>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedEntry = await database.updateDocument(
      DATABASE_ID,
      PROGRESS_ENTRIES_COLLECTION_ID,
      entryId,
      updates
    );

    revalidatePath('/progress');
    return { success: true, data: parseStringify(updatedEntry) };
  } catch (error) {
    console.error('Error updating progress entry:', error);
    return { success: false, error: 'Failed to update progress entry' };
  }
}

export async function deleteProgressEntry(entryId: string): Promise<ApiResponse<void>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    await database.deleteDocument(
      DATABASE_ID,
      PROGRESS_ENTRIES_COLLECTION_ID,
      entryId
    );

    revalidatePath('/progress');
    return { success: true };
  } catch (error) {
    console.error('Error deleting progress entry:', error);
    return { success: false, error: 'Failed to delete progress entry' };
  }
}

/**
 * Personal Records Actions
 */
export async function addPersonalRecord(record: Omit<PersonalRecord, '$id' | 'userId' | 'createdAt'>): Promise<ApiResponse<PersonalRecord>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    // Check for existing record for this exercise and type
    const existingRecords = await database.listDocuments(
      DATABASE_ID,
      PERSONAL_RECORDS_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.equal('exerciseId', [record.exerciseId]),
        Query.equal('type', [record.type])
      ]
    );

    let previousRecord = 0;
    if (existingRecords.documents.length > 0) {
      const currentBest = existingRecords.documents[0];
      previousRecord = currentBest.value;
      
      // Only add if it's actually a new record
      if (record.value <= currentBest.value) {
        return { success: false, error: 'This is not a new personal record' };
      }
    }

    const newRecord = await database.createDocument(
      DATABASE_ID,
      PERSONAL_RECORDS_COLLECTION_ID,
      ID.unique(),
      {
        ...record,
        userId: user.userId,
        previousRecord,
        createdAt: new Date().toISOString(),
      }
    );

    // Create achievement if it's a significant improvement
    if (previousRecord > 0 && record.value > previousRecord * 1.1) {
      await createAchievement(user.userId, {
        type: 'personal_record',
        title: 'New Personal Record!',
        description: `Achieved a new ${record.type} for ${record.exerciseName}`,
        badgeIcon: '🏆',
        badgeColor: 'gold',
        value: record.value,
        unit: record.unit,
        unlockedAt: new Date().toISOString(),
        isShared: false
      });
    }

    revalidatePath('/progress');
    revalidatePath('/dashboard');
    return { success: true, data: parseStringify(newRecord) };
  } catch (error) {
    console.error('Error adding personal record:', error);
    return { success: false, error: 'Failed to add personal record' };
  }
}

export async function getUserPersonalRecords(userId?: string): Promise<PersonalRecord[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();

    const result = await database.listDocuments(
      DATABASE_ID,
      PERSONAL_RECORDS_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.orderDesc('achievedAt')
      ]
    );

    return parseStringify(result.documents);
  } catch (error) {
    console.error('Error fetching personal records:', error);
    return [];
  }
}

/**
 * Goals Actions
 */
export async function createGoal(goal: Omit<Goal, '$id' | 'userId' | 'current' | 'status' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Goal>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();
    const now = new Date().toISOString();

    const newGoal = await database.createDocument(
      DATABASE_ID,
      GOALS_COLLECTION_ID,
      ID.unique(),
      {
        ...goal,
        userId: user.userId,
        current: 0,
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }
    );

    revalidatePath('/goals');
    return { success: true, data: parseStringify(newGoal) };
  } catch (error) {
    console.error('Error creating goal:', error);
    return { success: false, error: 'Failed to create goal' };
  }
}

export async function getUserGoals(userId?: string, status?: string): Promise<Goal[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();
    const queries = [
      Query.equal('userId', [user.userId]),
      Query.orderDesc('createdAt')
    ];

    if (status) {
      queries.push(Query.equal('status', [status]));
    }

    const result = await database.listDocuments(
      DATABASE_ID,
      GOALS_COLLECTION_ID,
      queries
    );

    return parseStringify(result.documents);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
}

export async function updateGoalProgress(goalId: string, newCurrent: number): Promise<ApiResponse<Goal>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    // Get current goal to check target
    const goal = await database.getDocument(DATABASE_ID, GOALS_COLLECTION_ID, goalId);
    
    let status = goal.status;
    if (newCurrent >= goal.target && status === 'active') {
      status = 'completed';
      
      // Create achievement for goal completion
      await createAchievement(user.userId, {
        type: 'goal_completion',
        title: 'Goal Achieved!',
        description: `Completed goal: ${goal.title}`,
        badgeIcon: '🎯',
        badgeColor: 'green',
        value: goal.target,
        unit: goal.unit,
        unlockedAt: new Date().toISOString(),
        isShared: false
      });
    }

    const updatedGoal = await database.updateDocument(
      DATABASE_ID,
      GOALS_COLLECTION_ID,
      goalId,
      {
        current: newCurrent,
        status,
        updatedAt: new Date().toISOString()
      }
    );

    revalidatePath('/goals');
    revalidatePath('/dashboard');
    return { success: true, data: parseStringify(updatedGoal) };
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return { success: false, error: 'Failed to update goal progress' };
  }
}

export async function updateGoal(
  goalId: string,
  updates: Partial<Omit<Goal, '$id' | 'userId' | 'createdAt'>>
): Promise<ApiResponse<Goal>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedGoal = await database.updateDocument(
      DATABASE_ID,
      GOALS_COLLECTION_ID,
      goalId,
      {
        ...updates,
        updatedAt: new Date().toISOString()
      }
    );

    revalidatePath('/goals');
    return { success: true, data: parseStringify(updatedGoal) };
  } catch (error) {
    console.error('Error updating goal:', error);
    return { success: false, error: 'Failed to update goal' };
  }
}

/**
 * Achievements Actions
 */
async function createAchievement(userId: string, achievement: Omit<Achievement, '$id' | 'userId'>): Promise<void> {
  try {
    const { database } = await createAdminClient();

    await database.createDocument(
      DATABASE_ID,
      ACHIEVEMENTS_COLLECTION_ID,
      ID.unique(),
      {
        ...achievement,
        userId,
      }
    );

    revalidatePath('/achievements');
  } catch (error) {
    console.error('Error creating achievement:', error);
  }
}

export async function getUserAchievements(userId?: string): Promise<Achievement[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();

    const result = await database.listDocuments(
      DATABASE_ID,
      ACHIEVEMENTS_COLLECTION_ID,
      [
        Query.equal('userId', [user.userId]),
        Query.orderDesc('unlockedAt')
      ]
    );

    return parseStringify(result.documents);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return [];
  }
}

export async function markAchievementAsShared(achievementId: string): Promise<ApiResponse<Achievement>> {
  try {
    const user = await getLoggedInUser();
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    const { database } = await createAdminClient();

    const updatedAchievement = await database.updateDocument(
      DATABASE_ID,
      ACHIEVEMENTS_COLLECTION_ID,
      achievementId,
      { isShared: true }
    );

    return { success: true, data: parseStringify(updatedAchievement) };
  } catch (error) {
    console.error('Error marking achievement as shared:', error);
    return { success: false, error: 'Failed to update achievement' };
  }
}

/**
 * Dashboard Statistics
 */
export async function getDashboardStats(userId?: string): Promise<DashboardStats> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return {
        workoutsThisWeek: 0,
        workoutsThisMonth: 0,
        totalWorkouts: 0,
        currentStreak: 0,
        longestStreak: 0,
        avgWorkoutDuration: 0,
        totalCaloriesBurned: 0,
        personalRecords: 0,
        goalsCompleted: 0,
        challengesParticipated: 0
      };
    }

    const { database } = await createAdminClient();

    // Get date ranges
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get workout sessions
    const [weeklyWorkouts, monthlyWorkouts, allWorkouts] = await Promise.all([
      database.listDocuments(DATABASE_ID, 'workout_sessions', [
        Query.equal('userId', [user.userId]),
        Query.equal('status', ['completed']),
        Query.greaterThanEqual('startTime', startOfWeek.toISOString())
      ]),
      database.listDocuments(DATABASE_ID, 'workout_sessions', [
        Query.equal('userId', [user.userId]),
        Query.equal('status', ['completed']),
        Query.greaterThanEqual('startTime', startOfMonth.toISOString())
      ]),
      database.listDocuments(DATABASE_ID, 'workout_sessions', [
        Query.equal('userId', [user.userId]),
        Query.equal('status', ['completed'])
      ])
    ]);

    // Calculate total calories and average duration
    let totalCalories = 0;
    let totalDuration = 0;
    allWorkouts.documents.forEach((workout: any) => {
      totalCalories += workout.totalCalories || 0;
      totalDuration += workout.totalDuration || 0;
    });

    // Get personal records count
    const personalRecords = await database.listDocuments(DATABASE_ID, PERSONAL_RECORDS_COLLECTION_ID, [
      Query.equal('userId', [user.userId])
    ]);

    // Get completed goals count
    const completedGoals = await database.listDocuments(DATABASE_ID, GOALS_COLLECTION_ID, [
      Query.equal('userId', [user.userId]),
      Query.equal('status', ['completed'])
    ]);

    // Calculate workout streak (simplified)
    const streak = calculateWorkoutStreak(allWorkouts.documents);

    return {
      workoutsThisWeek: weeklyWorkouts.total,
      workoutsThisMonth: monthlyWorkouts.total,
      totalWorkouts: allWorkouts.total,
      currentStreak: streak.current,
      longestStreak: streak.longest,
      avgWorkoutDuration: allWorkouts.total > 0 ? Math.round(totalDuration / allWorkouts.total) : 0,
      totalCaloriesBurned: totalCalories,
      personalRecords: personalRecords.total,
      goalsCompleted: completedGoals.total,
      challengesParticipated: 0 // Would be calculated from challenges collection
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      workoutsThisWeek: 0,
      workoutsThisMonth: 0,
      totalWorkouts: 0,
      currentStreak: 0,
      longestStreak: 0,
      avgWorkoutDuration: 0,
      totalCaloriesBurned: 0,
      personalRecords: 0,
      goalsCompleted: 0,
      challengesParticipated: 0
    };
  }
}

export async function getWeeklyProgress(userId?: string): Promise<WeeklyProgress[]> {
  try {
    const user = userId ? { userId } : await getLoggedInUser();
    if (!user) {
      return [];
    }

    const { database } = await createAdminClient();

    // Get last 7 days of workouts
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const workouts = await database.listDocuments(DATABASE_ID, 'workout_sessions', [
      Query.equal('userId', [user.userId]),
      Query.equal('status', ['completed']),
      Query.greaterThanEqual('startTime', startDate.toISOString()),
      Query.orderAsc('startTime')
    ]);

    // Group by date
    const progressByDate: { [key: string]: WeeklyProgress } = {};
    
    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      progressByDate[dateStr] = {
        date: dateStr,
        workouts: 0,
        duration: 0,
        calories: 0
      };
    }

    // Add actual workout data
    workouts.documents.forEach((workout: any) => {
      const dateStr = workout.startTime.split('T')[0];
      if (progressByDate[dateStr]) {
        progressByDate[dateStr].workouts += 1;
        progressByDate[dateStr].duration += workout.totalDuration || 0;
        progressByDate[dateStr].calories += workout.totalCalories || 0;
      }
    });

    return Object.values(progressByDate).sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching weekly progress:', error);
    return [];
  }
}

function calculateWorkoutStreak(workouts: any[]): { current: number; longest: number } {
  if (workouts.length === 0) return { current: 0, longest: 0 };

  // Sort workouts by date
  const sortedWorkouts = workouts
    .map(w => new Date(w.startTime).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // Remove duplicates (same day workouts)
  const uniqueDates = [...new Set(sortedWorkouts)];

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // Check if current streak is active
  if (uniqueDates.includes(today) || uniqueDates.includes(yesterday)) {
    let currentDate = new Date();
    for (const workoutDate of uniqueDates) {
      if (workoutDate === currentDate.toDateString()) {
        currentStreak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(uniqueDates[i - 1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}