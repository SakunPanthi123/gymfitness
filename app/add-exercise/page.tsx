"use client";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/useUser";
import { useExercise } from "@/hooks/useExercise";

// Exercise types
const exerciseTypes = [
    { value: "cardio", label: "Cardio" },
    { value: "strength", label: "Strength Training" },
    { value: "flexibility", label: "Flexibility" },
    { value: "balance", label: "Balance" },
    { value: "sports", label: "Sports" },
];

// Common fitness goals
const fitnessGoals = [
    { id: "weight-loss", label: "Weight Loss" },
    { id: "muscle-gain", label: "Muscle Gain" },
    { id: "endurance", label: "Improve Endurance" },
    { id: "flexibility", label: "Increase Flexibility" },
    { id: "strength", label: "Build Strength" },
    { id: "speed", label: "Improve Speed" },
];

// Form schema
const formSchema = z.object({
    name: z.string().min(2, {
        message: "Exercise name must be at least 2 characters.",
    }),
    type: z.string({
        required_error: "Please select an exercise type.",
    }),
    duration: z.coerce.number().min(1, {
        message: "Duration must be at least 1 minute.",
    }),
    caloriesBurned: z.coerce.number().min(0, {
        message: "Calories burned must be 0 or higher.",
    }),
    date: z.date({
        required_error: "Please select a date.",
    }),
    notes: z.string().optional(),
    goals: z.array(z.string()).optional(),
});

export default function AddExercisePage() {
    const router = useRouter();
    const { user, isLoading } = useUser();
    const { addNewExercise, isAddingExercise } = useExercise();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/signin");
        }
    }, [isLoading, user, router]);

    // Initialize form
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            duration: 30,
            caloriesBurned: 0,
            date: new Date(),
            notes: "",
            goals: [],
        },
    });

    // Handle form submission
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Format date as ISO string for storage
        const formattedValues = {
            ...values,
            date: values.date.toISOString(),
        };

        // Use the new hook to add the exercise
        addNewExercise(formattedValues);
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
                    <p className="mt-4 text-gray-500 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <Button variant="ghost" asChild className="mb-6">
                    <Link href="/" className="flex items-center">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </Button>

                <div className="max-w-2xl mx-auto">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">Add Your Today's Exercise</CardTitle>
                            <CardDescription>
                                Record today's workout details to track your progress
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exercise Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Morning Run" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Enter the name of your workout
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="type"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Exercise Type</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select an exercise type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {exerciseTypes.map((type) => (
                                                            <SelectItem key={type.value} value={type.value}>
                                                                {type.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormDescription>
                                                    Choose the category of your workout
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="duration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Duration (minutes)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            step={1}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        How long did you exercise?
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="caloriesBurned"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Calories Burned</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            step={1}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>
                                                        Estimate of calories burned
                                                    </FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-col">
                                                <FormLabel>Date</FormLabel>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <FormControl>
                                                            <Button
                                                                variant={"outline"}
                                                                className={
                                                                    "w-full pl-3 text-left font-normal"
                                                                }
                                                            >
                                                                {field.value ? (
                                                                    format(field.value, "PPP")
                                                                ) : (
                                                                    <span>Pick a date</span>
                                                                )}
                                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                            </Button>
                                                        </FormControl>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" align="start">
                                                        <Calendar
                                                            mode="single"
                                                            selected={field.value}
                                                            onSelect={field.onChange}
                                                            disabled={(date) =>
                                                                date > new Date() || date < new Date("1900-01-01")
                                                            }
                                                            initialFocus
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <FormDescription>
                                                    When did you complete this exercise?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="goals"
                                        render={() => (
                                            <FormItem>
                                                <div className="mb-4">
                                                    <FormLabel>Goals</FormLabel>
                                                    <FormDescription>
                                                        Select the goals this exercise helps you achieve
                                                    </FormDescription>
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {fitnessGoals.map((goal) => (
                                                        <FormField
                                                            key={goal.id}
                                                            control={form.control}
                                                            name="goals"
                                                            render={({ field }) => {
                                                                return (
                                                                    <FormItem
                                                                        key={goal.id}
                                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                                    >
                                                                        <FormControl>
                                                                            <Checkbox
                                                                                checked={field.value?.includes(goal.id)}
                                                                                onCheckedChange={(checked) => {
                                                                                    return checked
                                                                                        ? field.onChange([
                                                                                            ...(field.value || []),
                                                                                            goal.id,
                                                                                        ])
                                                                                        : field.onChange(
                                                                                            field.value?.filter(
                                                                                                (value) => value !== goal.id
                                                                                            )
                                                                                        );
                                                                                }}
                                                                            />
                                                                        </FormControl>
                                                                        <FormLabel className="font-normal">
                                                                            {goal.label}
                                                                        </FormLabel>
                                                                    </FormItem>
                                                                );
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Add any additional notes about your workout"
                                                        className="resize-none"
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Optional: Record how you felt, progress made, etc.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.back()}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isAddingExercise}>
                                            {isAddingExercise ? "Saving..." : "Save Exercise"}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}