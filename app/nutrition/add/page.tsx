"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Search, Plus, Check } from "lucide-react";
import Link from "next/link";
import { useFoods, useMealEntries } from "@/hooks/useNutrition";
import { toast } from "sonner";
import type { Food, MealEntry } from "@/lib/types";

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snacks' }
];

function AddFoodContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultMealType = searchParams.get('meal') || 'breakfast';

  const [step, setStep] = useState<'search' | 'details'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFood, setSelectedFood] = useState<Food | null>(null);
  const [mealType, setMealType] = useState(defaultMealType);
  const [quantity, setQuantity] = useState('1');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const { searchFoodsQuery, createNewFood } = useFoods();
  const { addEntry } = useMealEntries();

  // Search foods when query changes
  const { data: searchResults, isLoading: isSearching } = searchFoodsQuery({
    query: searchQuery,
    limit: 20
  });

  const handleFoodSelect = (food: Food) => {
    setSelectedFood(food);
    setStep('details');
  };

  const handleAddEntry = async () => {
    if (!selectedFood) return;

    const quantityNum = parseFloat(quantity) || 1;
    const calories = Math.round(selectedFood.caloriesPerServing * quantityNum);
    const macros = {
      protein: selectedFood.macros.protein * quantityNum,
      carbs: selectedFood.macros.carbs * quantityNum,
      fat: selectedFood.macros.fat * quantityNum,
      fiber: selectedFood.macros.fiber * quantityNum,
      sugar: selectedFood.macros.sugar * quantityNum,
    };

    const entry: Omit<MealEntry, '$id' | 'userId'> = {
      foodId: selectedFood.$id!,
      foodName: selectedFood.name,
      quantity: quantityNum,
      servingSize: selectedFood.servingSize,
      calories,
      macros,
      mealType: mealType as any,
      date: selectedDate,
      time: new Date().toISOString(),
    };

    addEntry(entry, {
      onSuccess: () => {
        router.push('/nutrition');
      }
    });
  };

  const calculateNutrition = () => {
    if (!selectedFood) return null;
    const quantityNum = parseFloat(quantity) || 1;
    return {
      calories: Math.round(selectedFood.caloriesPerServing * quantityNum),
      protein: Math.round(selectedFood.macros.protein * quantityNum * 10) / 10,
      carbs: Math.round(selectedFood.macros.carbs * quantityNum * 10) / 10,
      fat: Math.round(selectedFood.macros.fat * quantityNum * 10) / 10,
    };
  };

  const nutrition = calculateNutrition();

  if (step === 'details' && selectedFood) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setStep('search')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
          <h1 className="text-2xl font-bold">Add Food Entry</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{selectedFood.name}</CardTitle>
            <CardDescription>
              {selectedFood.brand} • Per {selectedFood.servingSize}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date and Meal Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="meal">Meal Type</Label>
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mealTypes.map((meal) => (
                      <SelectItem key={meal.value} value={meal.value}>
                        {meal.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                step="0.1"
                min="0.1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="1.0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Servings of {selectedFood.servingSize}
              </p>
            </div>

            <Separator />

            {/* Nutrition Summary */}
            {nutrition && (
              <div>
                <h3 className="font-medium mb-3">Nutrition Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Calories:</span>
                    <span className="font-medium">{nutrition.calories} kcal</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Protein:</span>
                    <span className="font-medium">{nutrition.protein}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Carbs:</span>
                    <span className="font-medium">{nutrition.carbs}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fat:</span>
                    <span className="font-medium">{nutrition.fat}g</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAddEntry} className="flex-1">
                <Check className="h-4 w-4 mr-2" />
                Add to {mealTypes.find(m => m.value === mealType)?.label}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/nutrition">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/nutrition">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Nutrition
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add Food</h1>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Foods</CardTitle>
          <CardDescription>
            Find food items to add to your nutrition log
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for foods (e.g., chicken breast, apple, oats)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchQuery && (
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {isSearching ? 'Searching...' : `${searchResults?.items.length || 0} results found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSearching ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching foods...</p>
              </div>
            ) : searchResults?.items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500 mb-3">
                  No foods found for "{searchQuery}"
                </p>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Custom Food
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults?.items.map((food) => (
                  <div
                    key={food.$id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => handleFoodSelect(food)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{food.name}</h3>
                        {food.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {food.brand} • {food.servingSize} • {food.caloriesPerServing} kcal
                      </p>
                      <div className="flex gap-3 text-xs text-gray-400 mt-1">
                        <span>P: {food.macros.protein}g</span>
                        <span>C: {food.macros.carbs}g</span>
                        <span>F: {food.macros.fat}g</span>
                      </div>
                    </div>
                    <Button size="sm">
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!searchQuery && (
        <Card>
          <CardContent className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Search for Foods</h3>
            <p className="text-gray-500 mb-4">
              Start typing to search our food database
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['chicken breast', 'banana', 'oats', 'greek yogurt', 'broccoli'].map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function AddFoodPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddFoodContent />
    </Suspense>
  );
}