"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar as CalendarIcon, Target, Trophy, Zap, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useGoals } from "@/hooks/useProgress";
import { toast } from "sonner";
import type { Goal } from "@/lib/types";

const goalTypes = [
  { value: 'fitness', label: 'Fitness Goal', icon: TrendingUp, color: 'bg-red-100 text-red-800' },
  { value: 'nutrition', label: 'Nutrition Goal', icon: Zap, color: 'bg-green-100 text-green-800' },
  { value: 'habit', label: 'Habit Building', icon: Target, color: 'bg-blue-100 text-blue-800' },
  { value: 'custom', label: 'Custom Goal', icon: Target, color: 'bg-gray-100 text-gray-800' }
];

const timeframes = [
  { value: '1_week', label: '1 Week' },
  { value: '2_weeks', label: '2 Weeks' },
  { value: '1_month', label: '1 Month' },
  { value: '3_months', label: '3 Months' },
  { value: '6_months', label: '6 Months' },
  { value: '1_year', label: '1 Year' },
  { value: 'custom', label: 'Custom Date' }
];

const units = [
  { value: 'kg', label: 'kg' },
  { value: 'lbs', label: 'lbs' },
  { value: 'reps', label: 'reps' },
  { value: 'minutes', label: 'minutes' },
  { value: 'days', label: 'days' },
  { value: 'workouts', label: 'workouts' },
  { value: '%', label: '%' },
  { value: 'custom', label: 'custom' }
];

export default function NewGoalPage() {
  const router = useRouter();
  const { createNewGoal } = useGoals();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    target: '',
    unit: '',
    timeframe: '',
    customUnit: '',
    category: 'fitness',
    priority: 'medium' as 'low' | 'medium' | 'high',
    reminders: false
  });
  const [deadline, setDeadline] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDeadlineFromTimeframe = (timeframe: string): Date => {
    const now = new Date();
    switch (timeframe) {
      case '1_week':
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      case '2_weeks':
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      case '1_month':
        return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
      case '3_months':
        return new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
      case '6_months':
        return new Date(now.getFullYear(), now.getMonth() + 6, now.getDate());
      case '1_year':
        return new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      default:
        return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // Default to 1 month
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.type || !formData.target) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const targetValue = parseFloat(formData.target);
      if (isNaN(targetValue)) {
        toast.error('Target value must be a number');
        return;
      }

      const finalDeadline = formData.timeframe === 'custom' 
        ? deadline 
        : getDeadlineFromTimeframe(formData.timeframe);

      if (!finalDeadline) {
        toast.error('Please select a deadline');
        return;
      }

      const finalUnit = formData.unit === 'custom' ? formData.customUnit : formData.unit;

      const goal: Omit<Goal, '$id' | 'userId' | 'current' | 'status' | 'createdAt' | 'updatedAt'> = {
        title: formData.title,
        description: formData.description,
        type: formData.type as any,
        target: targetValue,
        unit: finalUnit,
        deadline: finalDeadline.toISOString(),
        category: formData.category,
        priority: formData.priority,
        reminders: formData.reminders
      };

      createNewGoal(goal, {
        onSuccess: () => {
          router.push('/goals');
        }
      });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedGoalType = goalTypes.find(type => type.value === formData.type);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/goals">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Goals
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Create New Goal</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Goal Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Type</CardTitle>
            <CardDescription>
              Choose the type of goal you want to achieve
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {goalTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleInputChange('type', type.value)}
                    className={`p-3 border-2 rounded-lg text-center transition-colors ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
            {selectedGoalType && (
              <Badge className={`mt-3 ${selectedGoalType.color}`}>
                Selected: {selectedGoalType.label}
              </Badge>
            )}
          </CardContent>
        </Card>

        {/* Goal Details */}
        <Card>
          <CardHeader>
            <CardTitle>Goal Details</CardTitle>
            <CardDescription>
              Provide specific information about your goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Goal Title *</Label>
              <Input
                id="title"
                placeholder="e.g., Lose 10 kg, Run 5km, Build chest strength"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your goal and why it's important to you..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target">Target Value *</Label>
                <Input
                  id="target"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 10, 75, 100"
                  value={formData.target}
                  onChange={(e) => handleInputChange('target', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit *</Label>
                <Select value={formData.unit} onValueChange={(value) => handleInputChange('unit', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit.value} value={unit.value}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.unit === 'custom' && (
              <div>
                <Label htmlFor="customUnit">Custom Unit</Label>
                <Input
                  id="customUnit"
                  placeholder="e.g., miles, sessions, points"
                  value={formData.customUnit}
                  onChange={(e) => handleInputChange('customUnit', e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
            <CardDescription>
              Set a deadline to keep yourself motivated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select value={formData.timeframe} onValueChange={(value) => handleInputChange('timeframe', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  {timeframes.map((timeframe) => (
                    <SelectItem key={timeframe.value} value={timeframe.value}>
                      {timeframe.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.timeframe === 'custom' && (
              <div>
                <Label>Custom Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            {formData.timeframe && formData.timeframe !== 'custom' && (
              <div className="text-sm text-gray-500">
                Deadline: {format(getDeadlineFromTimeframe(formData.timeframe), "PPP")}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Privacy & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium">Goal Priority</h3>
                <p className="text-sm text-gray-500">
                  Set the priority level for this goal
                </p>
              </div>
              <Select value={formData.priority} onValueChange={(value: 'low' | 'medium' | 'high') => handleInputChange('priority', value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium">Reminders</h3>
                <p className="text-sm text-gray-500">
                  Enable notifications for this goal
                </p>
              </div>
              <Button
                type="button"
                variant={formData.reminders ? "default" : "outline"}
                size="sm"
                onClick={() => handleInputChange('reminders', !formData.reminders)}
              >
                {formData.reminders ? 'Enabled' : 'Disabled'}
              </Button>
            </div>

            <div className="flex gap-3">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
              <Button variant="outline" asChild>
                <Link href="/goals">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}