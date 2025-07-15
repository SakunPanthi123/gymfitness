"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { 
  Plus, 
  Search, 
  Utensils,
  Target,
  TrendingUp,
  Droplets,
  Apple,
  Coffee,
  Sun,
  Moon,
  Pizza
} from "lucide-react";
import { useDailyNutrition, useMealEntries, useNutritionTracking } from "@/hooks/useNutrition";
import { ProgressRing, MacroRing } from "@/components/ui/charts";

export default function NutritionPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  const { dailyNutrition, isLoading, addWater, getNutritionProgress, getRemainingNutrition } = useDailyNutrition(selectedDate);
  const { entriesByMealType, isLoading: isLoadingEntries } = useMealEntries(selectedDate);
  const { formatWaterIntake, getMacroDistribution } = useNutritionTracking();

  const nutritionProgress = getNutritionProgress();
  const remainingNutrition = getRemainingNutrition();
  const macroDistribution = dailyNutrition ? getMacroDistribution(dailyNutrition.totalMacros) : null;

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: Sun, color: 'text-yellow-500' },
    { key: 'lunch', label: 'Lunch', icon: Sun, color: 'text-orange-500' },
    { key: 'dinner', label: 'Dinner', icon: Moon, color: 'text-purple-500' },
    { key: 'snack', label: 'Snacks', icon: Coffee, color: 'text-green-500' }
  ] as const;

  const getMealCalories = (mealType: string) => {
    return entriesByMealType[mealType as keyof typeof entriesByMealType]
      ?.reduce((total, entry) => total + entry.calories, 0) || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading nutrition data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Nutrition</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Track your daily nutrition and reach your goals
            </p>
          </div>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-auto"
            />
            <Button asChild>
              <Link href="/nutrition/add">
                <Plus className="h-4 w-4 mr-2" />
                Add Food
              </Link>
            </Button>
          </div>
        </div>

        {/* Daily Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Calories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Calories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold">
                  {dailyNutrition?.totalCalories || 0}
                </div>
                <div className="text-sm text-gray-500">
                  / {dailyNutrition?.goals.calories || 2000}
                </div>
              </div>
              <ProgressRing
                progress={nutritionProgress?.calories || 0}
                size={80}
                color="#ef4444"
              >
                <span className="text-xs text-gray-600">
                  {nutritionProgress?.calories || 0}%
                </span>
              </ProgressRing>
              <p className="text-xs text-gray-500 mt-2 text-center">
                {remainingNutrition?.calories || 0} remaining
              </p>
            </CardContent>
          </Card>

          {/* Protein */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Protein
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-red-600">
                  {dailyNutrition?.totalMacros.protein.toFixed(0) || 0}g
                </div>
                <div className="text-sm text-gray-500">
                  / {dailyNutrition?.goals.protein || 150}g
                </div>
              </div>
              <Progress 
                value={nutritionProgress?.protein || 0} 
                className="h-2 mb-2" 
              />
              <p className="text-xs text-gray-500 text-center">
                {remainingNutrition?.protein.toFixed(0) || 0}g remaining
              </p>
            </CardContent>
          </Card>

          {/* Carbs */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Carbs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-blue-600">
                  {dailyNutrition?.totalMacros.carbs.toFixed(0) || 0}g
                </div>
                <div className="text-sm text-gray-500">
                  / {dailyNutrition?.goals.carbs || 250}g
                </div>
              </div>
              <Progress 
                value={nutritionProgress?.carbs || 0} 
                className="h-2 mb-2" 
              />
              <p className="text-xs text-gray-500 text-center">
                {remainingNutrition?.carbs.toFixed(0) || 0}g remaining
              </p>
            </CardContent>
          </Card>

          {/* Fat */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Fat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl font-bold text-yellow-600">
                  {dailyNutrition?.totalMacros.fat.toFixed(0) || 0}g
                </div>
                <div className="text-sm text-gray-500">
                  / {dailyNutrition?.goals.fat || 67}g
                </div>
              </div>
              <Progress 
                value={nutritionProgress?.fat || 0} 
                className="h-2 mb-2" 
              />
              <p className="text-xs text-gray-500 text-center">
                {remainingNutrition?.fat.toFixed(0) || 0}g remaining
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Macro Distribution and Water */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Macro Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Macro Distribution</CardTitle>
              <CardDescription>Your daily macronutrient breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              {macroDistribution ? (
                <div className="flex items-center gap-8">
                  <MacroRing
                    protein={dailyNutrition?.totalMacros.protein || 0}
                    carbs={dailyNutrition?.totalMacros.carbs || 0}
                    fat={dailyNutrition?.totalMacros.fat || 0}
                    size={120}
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Protein ({macroDistribution.protein}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Carbs ({macroDistribution.carbs}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Fat ({macroDistribution.fat}%)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Pizza className="h-12 w-12 mx-auto mb-2" />
                  <p>No food logged yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Water Intake */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Droplets className="h-5 w-5 mr-2 text-blue-500" />
                Water Intake
              </CardTitle>
              <CardDescription>Stay hydrated throughout the day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {formatWaterIntake(dailyNutrition?.water || 0)}
                </div>
                <p className="text-sm text-gray-500">Goal: 2.5L</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addWater({ amount: 250 })}
                  className="flex-1"
                >
                  +250ml
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addWater({ amount: 500 })}
                  className="flex-1"
                >
                  +500ml
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => addWater({ amount: 1000 })}
                  className="flex-1"
                >
                  +1L
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meals */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {mealTypes.map(({ key, label, icon: Icon, color }) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Icon className={`h-5 w-5 mr-2 ${color}`} />
                    {label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {getMealCalories(key)} kcal
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingEntries ? (
                  <div className="flex items-center justify-center h-20">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : entriesByMealType[key as keyof typeof entriesByMealType].length > 0 ? (
                  <div className="space-y-2">
                    {entriesByMealType[key as keyof typeof entriesByMealType].map((entry) => (
                      <div key={entry.$id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <div>
                          <p className="font-medium text-sm">{entry.foodName}</p>
                          <p className="text-xs text-gray-500">
                            {entry.quantity} {entry.servingSize}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {entry.calories} kcal
                        </div>
                      </div>
                    ))}
                    <Button size="sm" variant="outline" className="w-full mt-2" asChild>
                      <Link href={`/nutrition/add?meal=${key}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Food
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Utensils className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-3">No food logged</p>
                    <Button size="sm" asChild>
                      <Link href={`/nutrition/add?meal=${key}`}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Food
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your nutrition goals and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <Button variant="outline" asChild>
                <Link href="/nutrition/goals">
                  <Target className="h-4 w-4 mr-2" />
                  Set Goals
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/nutrition/history">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View History
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/nutrition/foods">
                  <Search className="h-4 w-4 mr-2" />
                  Browse Foods
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}