"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Scale, Camera, Ruler, Percent } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/useProgress";
import { toast } from "sonner";
import type { ProgressEntry } from "@/lib/types";

const progressTypes = [
  {
    value: 'weight',
    label: 'Weight',
    icon: Scale,
    defaultUnit: 'kg',
    color: 'bg-blue-100 text-blue-800',
    description: 'Track your body weight changes'
  },
  {
    value: 'body_fat',
    label: 'Body Fat %',
    icon: Percent,
    defaultUnit: '%',
    color: 'bg-red-100 text-red-800',
    description: 'Monitor body fat percentage'
  },
  {
    value: 'muscle_mass',
    label: 'Muscle Mass',
    icon: Scale,
    defaultUnit: 'kg',
    color: 'bg-green-100 text-green-800',
    description: 'Track muscle mass gains'
  },
  {
    value: 'measurements',
    label: 'Body Measurements',
    icon: Ruler,
    defaultUnit: 'cm',
    color: 'bg-purple-100 text-purple-800',
    description: 'Record body measurements'
  },
  {
    value: 'photos',
    label: 'Progress Photo',
    icon: Camera,
    defaultUnit: '',
    color: 'bg-orange-100 text-orange-800',
    description: 'Visual progress tracking'
  }
];

const measurementParts = [
  'chest', 'waist', 'hips', 'bicep_left', 'bicep_right', 
  'thigh_left', 'thigh_right', 'neck', 'forearm_left', 'forearm_right'
];

function AddProgressContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get('type') || '';

  const { addEntry } = useProgress();

  const [formData, setFormData] = useState({
    type: defaultType,
    value: '',
    unit: '',
    notes: '',
    bodyPart: ''
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTypeChange = (type: string) => {
    const selectedType = progressTypes.find(t => t.value === type);
    setFormData(prev => ({
      ...prev,
      type,
      unit: selectedType?.defaultUnit || '',
      bodyPart: type === 'measurements' ? 'chest' : ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.type !== 'photos') {
      const numValue = parseFloat(formData.value);
      if (isNaN(numValue)) {
        toast.error('Value must be a number');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const entry: Omit<ProgressEntry, '$id' | 'userId' | 'createdAt'> = {
        type: formData.type as any,
        value: formData.type === 'photos' ? 0 : parseFloat(formData.value),
        unit: formData.unit,
        date: selectedDate,
        notes: formData.notes,
        bodyPart: formData.bodyPart || undefined,
        photoUrl: formData.type === 'photos' ? formData.value : undefined
      };

      addEntry(entry, {
        onSuccess: () => {
          router.push('/progress');
        }
      });
    } catch (error) {
      console.error('Error adding progress entry:', error);
      toast.error('Failed to add progress entry');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedType = progressTypes.find(type => type.value === formData.type);

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/progress">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Progress
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Add Progress Entry</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Progress Type Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Type</CardTitle>
            <CardDescription>
              Choose what type of progress you want to track
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {progressTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => handleTypeChange(type.value)}
                    className={`p-4 border-2 rounded-lg text-left transition-colors ${
                      formData.type === type.value
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" />
                      <div className="flex-1">
                        <h3 className="font-medium">{type.label}</h3>
                        <p className="text-sm text-gray-500">{type.description}</p>
                      </div>
                      {formData.type === type.value && (
                        <Badge className={type.color}>Selected</Badge>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Entry Details */}
        {formData.type && (
          <Card>
            <CardHeader>
              <CardTitle>Entry Details</CardTitle>
              <CardDescription>
                Record your {selectedType?.label.toLowerCase()} progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>

              {formData.type === 'measurements' && (
                <div>
                  <Label htmlFor="bodyPart">Body Part</Label>
                  <Select 
                    value={formData.bodyPart} 
                    onValueChange={(value) => handleInputChange('bodyPart', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select body part" />
                    </SelectTrigger>
                    <SelectContent>
                      {measurementParts.map((part) => (
                        <SelectItem key={part} value={part}>
                          {part.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="value">
                    {formData.type === 'photos' ? 'Photo URL' : 'Value'} *
                  </Label>
                  <Input
                    id="value"
                    type={formData.type === 'photos' ? 'url' : 'number'}
                    step={formData.type === 'body_fat' ? '0.1' : '0.01'}
                    placeholder={
                      formData.type === 'photos' 
                        ? 'https://example.com/photo.jpg'
                        : `e.g., ${formData.type === 'weight' ? '70.5' : formData.type === 'body_fat' ? '15.2' : '95.0'}`
                    }
                    value={formData.value}
                    onChange={(e) => handleInputChange('value', e.target.value)}
                    required
                  />
                </div>
                {formData.type !== 'photos' && (
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      placeholder={selectedType?.defaultUnit}
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about this measurement..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Privacy & Actions */}
        {formData.type && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting || !formData.type}
                >
                  {isSubmitting ? 'Adding...' : 'Add Progress Entry'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/progress">Cancel</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  );
}

export default function AddProgressPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddProgressContent />
    </Suspense>
  );
}