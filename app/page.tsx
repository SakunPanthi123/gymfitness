"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Activity, 
  Target, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Flame,
  Clock,
  Plus,
  Dumbbell,
  Apple,
  BarChart2
} from "lucide-react"
import { useUser } from "@/hooks/useUser"
import { useDashboardStats, useWeeklyProgress } from "@/hooks/useProgress"
import { useWorkoutSessions } from "@/hooks/useWorkout"
import { useDailyNutrition } from "@/hooks/useNutrition"
import { ProgressRing, SimpleLineChart, SimpleBarChart } from "@/components/ui/charts"

export default function Home() {
  const { user, isLoading } = useUser()
  const { stats, isLoading: isLoadingStats } = useDashboardStats()
  const { weeklyProgress, isLoading: isLoadingWeekly } = useWeeklyProgress()
  const { sessions, isLoading: isLoadingSessions } = useWorkoutSessions()
  const { dailyNutrition, isLoading: isLoadingNutrition } = useDailyNutrition()

  const recentSessions = sessions.slice(0, 5)
  const todayDate = new Date().toISOString().split('T')[0]

  // Calculate today's progress
  const todaysWorkouts = sessions.filter(s => s.date === todayDate && s.status === 'completed').length
  const todaysCalories = sessions
    .filter(s => s.date === todayDate && s.status === 'completed')
    .reduce((total, s) => total + (s.totalCalories || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName} {user?.lastName}!
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Here's your fitness summary for today.
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Today's Workouts */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Dumbbell className="h-4 w-4 mr-2" />
                Today's Workouts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todaysWorkouts}</div>
              <div className="mt-4 flex items-center justify-center">
                <ProgressRing 
                  progress={Math.min(todaysWorkouts * 50, 100)} 
                  size={60}
                  color="#10b981"
                >
                  <span className="text-xs text-gray-600">{todaysWorkouts}/2</span>
                </ProgressRing>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-emerald-600">
              Current streak: {stats?.currentStreak || 0} days
            </CardFooter>
          </Card>

          {/* Calories Burned Today */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Flame className="h-4 w-4 mr-2" />
                Calories Burned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{todaysCalories}</div>
              <div className="mt-4 flex items-center justify-center">
                <ProgressRing 
                  progress={Math.min((todaysCalories / 500) * 100, 100)} 
                  size={60}
                  color="#ef4444"
                >
                  <span className="text-xs text-gray-600">kcal</span>
                </ProgressRing>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-red-600">
              Goal: 500 kcal/day
            </CardFooter>
          </Card>

          {/* This Week */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.workoutsThisWeek || 0}</div>
              <div className="mt-4 flex items-center justify-center">
                <ProgressRing 
                  progress={Math.min(((stats?.workoutsThisWeek || 0) / 5) * 100, 100)} 
                  size={60}
                  color="#3b82f6"
                >
                  <span className="text-xs text-gray-600">workouts</span>
                </ProgressRing>
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-blue-600">
              Goal: 5 workouts/week
            </CardFooter>
          </Card>

          {/* Personal Records */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                <Trophy className="h-4 w-4 mr-2" />
                Personal Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.personalRecords || 0}</div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-2 bg-yellow-500 rounded-full transition-all" 
                  style={{ width: `${Math.min(((stats?.personalRecords || 0) / 10) * 100, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {stats?.personalRecords || 0}/10 target
              </p>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-yellow-600">
              Keep pushing your limits!
            </CardFooter>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Weekly Progress Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart2 className="h-5 w-5 mr-2" />
                Weekly Progress
              </CardTitle>
              <CardDescription>Your workout activity over the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingWeekly ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <SimpleLineChart 
                  data={weeklyProgress.map(day => ({
                    date: new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }),
                    value: day.workouts,
                    label: `${day.workouts} workouts`
                  }))}
                  height={200}
                  color="#3b82f6"
                />
              )}
            </CardContent>
          </Card>

          {/* Recent Workouts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                Recent Workouts
              </CardTitle>
              <CardDescription>Your latest workout sessions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingSessions ? (
                <div className="h-48 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : recentSessions.length > 0 ? (
                <ul className="space-y-3">
                  {recentSessions.map((session, i) => (
                    <li key={session.$id || i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div>
                        <p className="font-medium">{session.routineName || 'Custom Workout'}</p>
                        <p className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.totalDuration || 0} min · {session.totalCalories || 0} kcal
                        </p>
                      </div>
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        session.status === 'completed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {session.status}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <Dumbbell className="h-12 w-12 mb-2" />
                  <p>No workouts yet</p>
                  <p className="text-sm">Start your fitness journey today!</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/workouts">View All Workouts</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Nutrition Overview */}
        {dailyNutrition && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Apple className="h-5 w-5 mr-2" />
                Today's Nutrition
              </CardTitle>
              <CardDescription>Your nutritional intake for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {dailyNutrition.totalCalories}
                  </div>
                  <div className="text-sm text-gray-500">Calories</div>
                  <div className="text-xs text-gray-400">
                    Goal: {dailyNutrition.goals.calories}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {dailyNutrition.totalMacros.protein.toFixed(0)}g
                  </div>
                  <div className="text-sm text-gray-500">Protein</div>
                  <div className="text-xs text-gray-400">
                    Goal: {dailyNutrition.goals.protein}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dailyNutrition.totalMacros.carbs.toFixed(0)}g
                  </div>
                  <div className="text-sm text-gray-500">Carbs</div>
                  <div className="text-xs text-gray-400">
                    Goal: {dailyNutrition.goals.carbs}g
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {dailyNutrition.totalMacros.fat.toFixed(0)}g
                  </div>
                  <div className="text-sm text-gray-500">Fat</div>
                  <div className="text-xs text-gray-400">
                    Goal: {dailyNutrition.goals.fat}g
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/nutrition">View Nutrition Details</Link>
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="pb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button size="lg" className="h-auto py-6" asChild>
              <Link href="/workouts/new">
                <div className="flex flex-col items-center">
                  <Plus className="h-6 w-6 mb-2" />
                  <span>Start Workout</span>
                </div>
              </Link>
            </Button>
            <Button size="lg" className="h-auto py-6" variant="outline" asChild>
              <Link href="/nutrition">
                <div className="flex flex-col items-center">
                  <Apple className="h-6 w-6 mb-2" />
                  <span>Log Nutrition</span>
                </div>
              </Link>
            </Button>
            <Button size="lg" className="h-auto py-6" variant="outline" asChild>
              <Link href="/progress">
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Track Progress</span>
                </div>
              </Link>
            </Button>
            <Button size="lg" className="h-auto py-6" variant="outline" asChild>
              <Link href="/goals">
                <div className="flex flex-col items-center">
                  <Target className="h-6 w-6 mb-2" />
                  <span>Set Goals</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}