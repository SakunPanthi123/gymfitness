"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { 
  Plus, 
  Target, 
  Trophy,
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  TrendingUp
} from "lucide-react";
import { useGoals } from "@/hooks/useProgress";

export default function GoalsPage() {
  const { goals, isLoading } = useGoals();

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoals = goals.filter(goal => goal.status === 'completed');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const getDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading goals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Goals</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Set targets, track progress, and achieve your fitness objectives
            </p>
          </div>
          <Button asChild>
            <Link href="/goals/new">
              <Plus className="h-4 w-4 mr-2" />
              New Goal
            </Link>
          </Button>
        </div>

        {/* Goals Overview */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{goals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Goals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{activeGoals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{completedGoals.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">
                {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Goals */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Active Goals
            </CardTitle>
            <CardDescription>Goals you're currently working towards</CardDescription>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const progress = calculateProgress(goal.current, goal.target);
                  const daysRemaining = getDaysRemaining(goal.deadline);
                  
                  return (
                    <div key={goal.$id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{goal.title}</h3>
                          <p className="text-gray-600 dark:text-gray-400 text-sm">{goal.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status}
                          </Badge>
                          <span className={`text-sm font-medium ${getPriorityColor(goal.priority)}`}>
                            {goal.priority}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{goal.current} / {goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                          <span>{progress}% complete</span>
                          {daysRemaining !== null && (
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {daysRemaining > 0 ? `${daysRemaining} days left` : 'Overdue'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/goals/${goal.$id}`}>
                            View Details
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/goals/${goal.$id}/update`}>
                            Update Progress
                          </Link>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">No active goals</h3>
                <p className="text-gray-500 mb-6">Set your first goal to start tracking your progress</p>
                <Button asChild>
                  <Link href="/goals/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Goal
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Completed Goals
              </CardTitle>
              <CardDescription>Goals you've successfully achieved</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {completedGoals.slice(0, 6).map((goal) => (
                  <div key={goal.$id} className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold">{goal.title}</h3>
                        <p className="text-green-700 dark:text-green-300 text-sm">{goal.description}</p>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600">
                        {goal.target} {goal.unit} achieved
                      </span>
                      <span className="text-green-500">
                        {new Date(goal.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              {completedGoals.length > 6 && (
                <Button variant="outline" className="w-full mt-4" asChild>
                  <Link href="/goals/completed">
                    View All Completed Goals
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your goals and track your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" asChild>
                <Link href="/goals/new">
                  <Plus className="h-4 w-4 mr-2" />
                  New Goal
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/goals/templates">
                  <Target className="h-4 w-4 mr-2" />
                  Goal Templates
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/progress">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Track Progress
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/goals/history">
                  <Clock className="h-4 w-4 mr-2" />
                  Goal History
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}