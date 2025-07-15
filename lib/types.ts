/**
 * Comprehensive type definitions for GymFitness application
 * Extends existing types with new features
 */

// Re-export existing types for backward compatibility
export type { User } from './user-actions';
export type { Exercise } from './exercise-actions';

// Enhanced Exercise Types
export interface ExerciseTemplate {
  $id?: string;
  name: string;
  category: string; // 'strength', 'cardio', 'flexibility', 'balance', 'sports'
  muscleGroups: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  imageUrl?: string;
  videoUrl?: string;
  tips: string[];
  createdAt: string;
  updatedAt: string;
}

// Workout Routines
export interface WorkoutRoutine {
  $id?: string;
  creatorId: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  category: string;
  goals: string[];
  exercises: WorkoutExercise[];
  isPublic: boolean;
  tags: string[];
  likes: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutExercise {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps?: number;
  duration?: number; // for cardio/timed exercises
  weight?: number;
  restTime: number; // in seconds
  notes?: string;
  order: number;
}

// Workout Sessions
export interface WorkoutSession {
  $id?: string;
  userId: string;
  routineId?: string;
  routineName?: string;
  startTime: string;
  endTime?: string;
  status: 'planned' | 'in-progress' | 'completed' | 'skipped';
  exercises: SessionExercise[];
  totalDuration?: number;
  totalCalories?: number;
  notes?: string;
  date: string;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseName: string;
  sets: SessionSet[];
  totalWeight?: number;
  totalReps?: number;
  totalDuration?: number;
  notes?: string;
}

export interface SessionSet {
  reps?: number;
  weight?: number;
  duration?: number;
  restTime?: number;
  completed: boolean;
  rpe?: number; // Rate of Perceived Exertion (1-10)
}

// Nutrition Tracking
export interface Food {
  $id?: string;
  name: string;
  brand?: string;
  category: string;
  servingSize: string;
  caloriesPerServing: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  micronutrients: Record<string, number>;
  isVerified: boolean;
  createdAt: string;
}

export interface MealEntry {
  $id?: string;
  userId: string;
  foodId: string;
  foodName: string;
  quantity: number;
  servingSize: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  date: string;
  time: string;
}

export interface DailyNutrition {
  $id?: string;
  userId: string;
  date: string;
  totalCalories: number;
  totalMacros: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  meals: {
    breakfast: MealEntry[];
    lunch: MealEntry[];
    dinner: MealEntry[];
    snack: MealEntry[];
  };
  water: number; // in ml
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

// Progress Tracking
export interface ProgressEntry {
  $id?: string;
  userId: string;
  type: 'weight' | 'body_fat' | 'muscle_mass' | 'measurements' | 'photos';
  value: number;
  unit: string;
  bodyPart?: string; // for measurements
  photoUrl?: string; // for photos
  notes?: string;
  date: string;
  createdAt: string;
}

export interface PersonalRecord {
  $id?: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  type: 'max_weight' | 'max_reps' | 'max_duration' | 'max_distance';
  value: number;
  unit: string;
  workoutSessionId?: string;
  previousRecord?: number;
  achievedAt: string;
  createdAt: string;
}

// Social Features
export interface SocialPost {
  $id?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  type: 'workout' | 'achievement' | 'progress' | 'general';
  content: string;
  images?: string[];
  workoutSessionId?: string;
  achievementId?: string;
  progressEntryId?: string;
  likes: number;
  comments: number;
  isPublic: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SocialComment {
  $id?: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  likes: number;
  createdAt: string;
}

export interface UserFollow {
  $id?: string;
  followerId: string;
  followingId: string;
  createdAt: string;
}

export interface PostLike {
  $id?: string;
  postId: string;
  userId: string;
  createdAt: string;
}

// Challenges and Leaderboards
export interface Challenge {
  $id?: string;
  creatorId: string;
  name: string;
  description: string;
  type: 'workout_count' | 'total_duration' | 'calories_burned' | 'distance' | 'custom';
  metric: string;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  participants: string[];
  leaderboard: LeaderboardEntry[];
  prizes: string[];
  isPublic: boolean;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  userName: string;
  userAvatar?: string;
  value: number;
  rank: number;
  lastUpdated: string;
}

// Goals and Achievements
export interface Goal {
  $id?: string;
  userId: string;
  type: 'fitness' | 'nutrition' | 'habit' | 'custom';
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  status: 'active' | 'completed' | 'paused' | 'failed';
  category: string;
  priority: 'low' | 'medium' | 'high';
  reminders: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  $id?: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  badgeIcon: string;
  badgeColor: string;
  value: number;
  unit?: string;
  unlockedAt: string;
  isShared: boolean;
}

// Admin Types
export interface AdminUser {
  $id?: string;
  userId: string;
  role: 'admin' | 'moderator';
  permissions: string[];
  assignedBy: string;
  assignedAt: string;
}

export interface ContentReport {
  $id?: string;
  reporterId: string;
  reportedUserId?: string;
  reportedPostId?: string;
  reportedCommentId?: string;
  reason: string;
  description: string;
  status: 'pending' | 'reviewing' | 'resolved' | 'dismissed';
  assignedTo?: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PlatformAnalytics {
  $id?: string;
  date: string;
  metrics: {
    activeUsers: number;
    newSignups: number;
    workoutsCompleted: number;
    totalWorkouts: number;
    avgSessionDuration: number;
    postsCreated: number;
    commentsCreated: number;
    challengesActive: number;
  };
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Form Types
export interface WorkoutPlannerData {
  date: string;
  routines: {
    routineId: string;
    timeSlot: string;
    duration: number;
  }[];
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  water: number;
}

// Dashboard Types
export interface DashboardStats {
  workoutsThisWeek: number;
  workoutsThisMonth: number;
  totalWorkouts: number;
  currentStreak: number;
  longestStreak: number;
  avgWorkoutDuration: number;
  totalCaloriesBurned: number;
  personalRecords: number;
  goalsCompleted: number;
  challengesParticipated: number;
}

export interface WeeklyProgress {
  date: string;
  workouts: number;
  duration: number;
  calories: number;
}