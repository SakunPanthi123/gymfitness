"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, UserCircle, ListTodo, BarChart2, TrendingUp } from "lucide-react"
import { useUser } from "@/hooks/useUser"

export default function Home() {
  const {user, isLoading} = useUser()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {isLoading ? '..' : `${user?.firstName} ${user?.lastName}` }</h1>
          <p className="text-gray-500 dark:text-gray-400">Here's your fitness summary for today.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Daily Miles */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Miles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3.2</div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 bg-emerald-500 rounded-full" style={{ width: '64%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">64% of daily goal</p>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-emerald-600">
              +0.8 miles from yesterday
            </CardFooter>
          </Card>

          {/* Monthly Miles */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Miles This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">42.7</div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 bg-blue-500 rounded-full" style={{ width: '71%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">71% of monthly goal</p>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-blue-600">
              +12.2 miles from last month
            </CardFooter>
          </Card>

          {/* Daily Push-ups */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Daily Push-ups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">30</div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 bg-purple-500 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">60% of daily goal</p>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-purple-600">
              +5 push-ups from yesterday
            </CardFooter>
          </Card>

          {/* Monthly Push-ups */}
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Push-ups This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">450</div>
              <div className="mt-4 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-2 bg-orange-500 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">75% of monthly goal</p>
            </CardContent>
            <CardFooter className="pt-0 text-sm text-orange-600">
              +125 push-ups from last month
            </CardFooter>
          </Card>
        </div>

        {/* Recent Activities Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Recent Activities</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Progress</CardTitle>
                <CardDescription>Your activity over the past 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center text-gray-400">
                  <BarChart2 className="h-12 w-12 mb-2" />
                  <span className="ml-2">Activity Chart</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Exercises</CardTitle>
                <CardDescription>Your latest workout sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {[
                    { name: "Morning Run", date: "Today", duration: "25 min", type: "Cardio" },
                    { name: "Upper Body Workout", date: "Yesterday", duration: "45 min", type: "Strength" },
                    { name: "Evening Walk", date: "2 days ago", duration: "30 min", type: "Cardio" },
                  ].map((exercise, i) => (
                    <li key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-sm text-gray-500">{exercise.date} · {exercise.duration}</p>
                      </div>
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {exercise.type}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="w-full" asChild>
                  <Link href="/exercises">View All Exercises</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 pb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Button size="lg" className="h-auto py-6" asChild>
              <Link href="/add-exercise">
                <div className="flex flex-col items-center">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span>Add New Exercise</span>
                </div>
              </Link>
            </Button>
            <Button size="lg" className="h-auto py-6" variant="outline" asChild>
              <Link href="/goals">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-2"><path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/><path d="M4.93 19.07l2.83-2.83"/><path d="M16.24 7.76l2.83-2.83"/></svg>
                  <span>Set New Goals</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}