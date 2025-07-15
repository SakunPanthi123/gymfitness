"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { 
  Plus, 
  TrendingUp, 
  TrendingDown,
  Minus,
  Scale,
  Ruler,
  Trophy,
  Target,
  Calendar,
  Camera,
  Activity
} from "lucide-react";
import { useProgressEntries, usePersonalRecords, useProgressTracking } from "@/hooks/useProgress";
import { SimpleLineChart } from "@/components/ui/charts";

export default function ProgressPage() {
  const [selectedType, setSelectedType] = useState<string>("weight");
  
  const { entries, isLoading } = useProgressEntries(undefined, selectedType);
  const { records, isLoading: isLoadingRecords } = usePersonalRecords();
  const { getProgressTrend, formatProgressValue } = useProgressTracking();

  const progressTypes = [
    { key: "weight", label: "Weight", icon: Scale, color: "text-blue-500" },
    { key: "body_fat", label: "Body Fat", icon: Activity, color: "text-orange-500" },
    { key: "muscle_mass", label: "Muscle Mass", icon: Activity, color: "text-green-500" },
    { key: "measurements", label: "Measurements", icon: Ruler, color: "text-purple-500" },
    { key: "photos", label: "Photos", icon: Camera, color: "text-pink-500" }
  ];

  const getLatestEntry = (type: string) => {
    return entries.find(entry => entry.type === type);
  };

  const getChartData = (type: string) => {
    return entries
      .filter(entry => entry.type === type)
      .slice(0, 10)
      .reverse()
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: entry.value,
        label: `${formatProgressValue(entry.value, entry.unit)} on ${entry.date}`
      }));
  };

  const getTrendIcon = (type: string) => {
    const trend = getProgressTrend(entries, type);
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-500" />;
      default: return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const recentRecords = records.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Progress Tracking</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Monitor your fitness journey and celebrate achievements
            </p>
          </div>
          <Button asChild>
            <Link href="/progress/add">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Link>
          </Button>
        </div>

        {/* Progress Type Selector */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Track Your Progress</CardTitle>
            <CardDescription>Choose what you'd like to track and visualize</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-5">
              {progressTypes.map(({ key, label, icon: Icon, color }) => (
                <Button
                  key={key}
                  variant={selectedType === key ? "default" : "outline"}
                  className="h-20 flex flex-col"
                  onClick={() => setSelectedType(key)}
                >
                  <Icon className={`h-6 w-6 mb-2 ${selectedType === key ? 'text-white' : color}`} />
                  <span className="text-sm">{label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Progress Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {progressTypes.map(({ key, label, icon: Icon, color }) => {
            const latestEntry = getLatestEntry(key);
            const trend = getProgressTrend(entries, key);
            
            return (
              <Card key={key} className={selectedType === key ? "ring-2 ring-blue-500" : ""}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                    <Icon className={`h-4 w-4 mr-2 ${color}`} />
                    {label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {latestEntry ? (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-2xl font-bold">
                          {formatProgressValue(latestEntry.value, latestEntry.unit)}
                        </div>
                        {getTrendIcon(key)}
                      </div>
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(latestEntry.date).toLocaleDateString()}
                      </p>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500 mb-2">No data yet</p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/progress/add?type=${key}`}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              {progressTypes.find(t => t.key === selectedType)?.label} Progress
            </CardTitle>
            <CardDescription>Your progress over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <SimpleLineChart
                data={getChartData(selectedType)}
                height={300}
                color="#3b82f6"
              />
            )}
          </CardContent>
        </Card>

        {/* Personal Records and Recent Entries */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Personal Records */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                Personal Records
              </CardTitle>
              <CardDescription>Your latest achievements and PRs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingRecords ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                </div>
              ) : recentRecords.length > 0 ? (
                <div className="space-y-3">
                  {recentRecords.map((record) => (
                    <div key={record.$id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{record.exerciseName}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(record.achievedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-yellow-600">
                          {record.value} {record.unit}
                        </p>
                        {record.previousRecord && (
                          <p className="text-xs text-green-600">
                            +{(record.value - record.previousRecord).toFixed(1)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/progress/records">
                      View All Records
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No records yet</h3>
                  <p className="text-gray-500 mb-4">Start tracking workouts to set personal records</p>
                  <Button size="sm" asChild>
                    <Link href="/workouts">
                      Start Workout
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Entries */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Recent Entries
              </CardTitle>
              <CardDescription>Your latest progress updates</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : entries.slice(0, 5).length > 0 ? (
                <div className="space-y-3">
                  {entries.slice(0, 5).map((entry) => {
                    const type = progressTypes.find(t => t.key === entry.type);
                    const Icon = type?.icon || Activity;
                    
                    return (
                      <div key={entry.$id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center">
                          <Icon className={`h-4 w-4 mr-3 ${type?.color || 'text-gray-500'}`} />
                          <div>
                            <p className="font-medium text-sm">{type?.label || entry.type}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(entry.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {formatProgressValue(entry.value, entry.unit)}
                          </p>
                          {entry.notes && (
                            <p className="text-xs text-gray-500 max-w-20 truncate">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/progress/history">
                      View All Entries
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No entries yet</h3>
                  <p className="text-gray-500 mb-4">Start tracking your progress today</p>
                  <Button size="sm" asChild>
                    <Link href="/progress/add">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Entry
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your progress tracking and goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" asChild>
                <Link href="/progress/add">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entry
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/progress/photos">
                  <Camera className="h-4 w-4 mr-2" />
                  Progress Photos
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/goals">
                  <Target className="h-4 w-4 mr-2" />
                  Set Goals
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/progress/export">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Export Data
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}