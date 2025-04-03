I am building a gym fitness app using NextJs, shadcn/ui, default shadcn forms that use react hook form. I have created home page for now. 

homePage:
"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Activity, UserCircle, ListTodo, BarChart2, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-xl">GymFitness</span>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/add-exercise">
                <TrendingUp className="h-4 w-4 mr-2" />
                Add Exercise
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/exercises">
                <ListTodo className="h-4 w-4 mr-2" />
                All Exercises
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/profile">
                <UserCircle className="h-4 w-4 mr-2" />
                My Profile
              </Link>
            </Button>
          </nav>

          <Button variant="outline" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, Sakun!</h1>
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
            <Button size="lg" className="h-auto py-6" variant="outline" asChild>
              <Link href="/reports">
                <div className="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mb-2"><path d="M21 15V6"/><path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/><path d="M12 3v12"/><path d="M9.5 6a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/><path d="M3 3v18"/></svg>
                  <span>View Reports</span>
                </div>
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

signin page:
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-auth";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const { login, isSigningIn } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    login({ 
      email: values.email, 
      password: values.password 
    });
  }

  return (
    <div className="flex items-center h-screen">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Login to GymFitness</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSigningIn}>
                {isSigningIn ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/signup")}>
            Don't have an account? Sign up
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

signup page:
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/hooks/use-auth";

const formSchema = z.object({
  firstName: z.string().min(2, { 
    message: "First name must be at least 2 characters" 
  }),
  lastName: z.string().min(2, { 
    message: "Last name must be at least 2 characters" 
  }),
  email: z.string().email({ 
    message: "Invalid email address" 
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  membershipType: z.enum(["free", "basic", "premium"], {
    required_error: "Please select a membership type",
  }),
});

export default function SignupForm() {
  const router = useRouter();
  const { register, isSigningUp } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      membershipType: "free",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    register({
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      membershipType: values.membershipType
    });
  }

  return (
    <div className="flex flex-row h-screen items-center">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Join GymFitness</CardTitle>
          <CardDescription>
            Create an account to start your fitness journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="membershipType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a membership" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic ($9.99/month)</SelectItem>
                        <SelectItem value="premium">Premium ($19.99/month)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSigningUp}>
                {isSigningUp ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="link" onClick={() => router.push("/signin")}>
            Already have an account? Sign in
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

profile page:
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, UserCircle, LogOut, Mail, Edit, ChevronLeft } from "lucide-react"
import { useUser } from "@/hooks/use-auth"

export default function Profile() {
  const router = useRouter()
  const { user, isLoading, logout } = useUser()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/signin")
    }
  }, [isLoading, user, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <span className="font-bold text-xl">GymFitness</span>
          </div>

          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/add-exercise">Add Exercise</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/exercises">All Exercises</Link>
            </Button>
          </nav>

          <Button variant="outline" size="icon" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
                <UserCircle className="h-16 w-16 text-emerald-500" />
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">First Name</p>
                    <p className="font-semibold text-lg">{user?.firstname}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Name</p>
                    <p className="font-semibold text-lg">{user?.lastname}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <p className="font-semibold">{user?.email}</p>
                  </div>
                </div>

                <div className="pt-4">
                  <Button variant="outline" className="flex items-center">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch border-t pt-6">
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Need to leave? You can log back in anytime.</p>
              <Button 
                onClick={() => logout()}
                variant="destructive" 
                className="w-full flex items-center justify-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive emails about your activity</p>
                  </div>
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute right-1 top-0.5"></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Toggle dark mode on/off</p>
                  </div>
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full relative">
                    <div className="w-5 h-5 bg-white rounded-full absolute left-1 top-0.5"></div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Save Preferences</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}


These are the current pages. There is a custom hook useUser that handles the authentication and user data.
The hook is implemented as follows:

"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  getLoggedInUser, 
  signIn, 
  signUp, 
  logoutAccount, 
  updateUserProfile 
} from "@/lib/user.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Key for user query
const USER_QUERY_KEY = "user";

// Hook to get the current user
export function useUser() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data: user, isLoading, error } = useQuery({
    queryKey: [USER_QUERY_KEY],
    queryFn: async () => {
      const data = await getLoggedInUser();
      return data;
    },
  });

  // Sign In mutation
  const { mutate: login, isPending: isSigningIn } = useMutation({
    mutationFn: signIn,
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      toast("Successfully signed in");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("Login error:", error);
      toast("Unable to sign in");
    },
  });

  // Sign Up mutation
  const { mutate: register, isPending: isSigningUp } = useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      toast("Successfully signed up");
      router.push("/");
      router.refresh();
    },
    onError: (error) => {
      console.error("Registration error:", error);
      toast("Unable to sign up");
    },
  });

  // Logout mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAccount,
    onSuccess: () => {
      queryClient.setQueryData([USER_QUERY_KEY], null);
      toast("Successfully logged out");
      router.push("/signin");
      router.refresh();
    },
    onError: (error) => {
      console.error("Logout error:", error);
      toast("Error logging out");
    },
  });

  // Update profile mutation
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.setQueryData([USER_QUERY_KEY], data);
      toast("Profile updated successfully");
    },
    onError: (error) => {
      console.error("Profile update error:", error);
      toast("Error updating profile");
    },
  });

  return {
    user,
    isLoading,
    error,
    login,
    isSigningIn,
    register,
    isSigningUp,
    logout,
    isLoggingOut,
    updateProfile,
    isUpdatingProfile,
  };
}

Then are there are the appwrite auth and user actions that handle the authentication and user data. The appwrite auth is implemented as follows:

"use server";

import { Client, Account, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';

// Environment variables
const endpoint = 'https://cloud.appwrite.io/v1';
const projectId = '67ed3529002b3949fb45';
const apiKey = 'standard_1c45f04f2aa4c217654882e75d2e07e0ce7527a125b04cc470cbbb1f4dbded383f8cb9b36160bc7f59e376c82568b61c53a56fbbf66524a8ff15e19f01469b5a7ff2a31fadb593b084b2d8c469517bdd6ee4ac94a142cc9ed7d9db61ed2f9f22c80d80cc6d58a43723425efd8bb1a64bce94bfd3424d161ad59da266de1d85f1';

/**
 * Creates a session client for client-side operations
 * Uses session cookies for authentication
 */
export async function createSessionClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId);

  const session = (await cookies()).get("appwrite-session");

  if (!session || !session.value) {
    throw new Error("No session");
  }

  client.setSession(session.value);

  return {
    get account() {
      return new Account(client);
    },
  };
}

/**
 * Creates an admin client for server-side operations
 * Uses API key for authentication
 */
export async function createAdminClient() {
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);
  
  return {
    get account() {
      return new Account(client);
    },
    get database() {
      return new Databases(client);
    },
  };
}

user.actions.ts:
'use server';

import { ID, Query } from 'node-appwrite';
import { createAdminClient, createSessionClient } from './appwrite';
import { cookies } from 'next/headers';
import { revalidatePath } from "next/cache";

/**
 * User data interface
 */
export interface User {
  $id: string;
  userId: string;
  email: string;
  firstname: string;
  lastname: string;
  profileImage?: string;
  membershipType?: string;
  fitnessGoals?: string[];
}
const DATABASE_ID = '67ed35b10003889b2285';
const USERS_COLLECTION_ID = '67ed35ca00186f823ebf';

/**
 * Parse and stringify object to ensure it's a plain object
 */
export const parseStringify = async (obj: any) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Get user information by userId
 */
export const getUserInfo = async ({ userId }: { userId: string }) => {
  try {
    const { database } = await createAdminClient();

    const user = await database.listDocuments(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      [Query.equal('userId', [userId])]
    );

    if (!user.documents.length) return null;

    return parseStringify(user.documents[0]);
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Sign in a user with email and password
 */
export const signIn = async ({ 
  email, 
  password 
}: { 
  email: string; 
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
    });

    const user = await getUserInfo({ userId: session.userId });

    return parseStringify(user);
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

/**
 * Sign up a new user
 */
export const signUp = async ({ 
  email,
  password,
  firstName,
  lastName,
  fitnessGoals,
  membershipType
}: { 
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  fitnessGoals?: string;
  membershipType?: string;
}) => {
  try {
    const { account, database } = await createAdminClient();

    // Create user account
    const newUserAccount = await account.create(
      ID.unique(), 
      email, 
      password, 
      `${firstName} ${lastName}`
    );

    if (!newUserAccount) throw new Error('Error creating user account');

    // Add user to database with additional fitness information
    const newUser = await database.createDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      ID.unique(),
      {
        userId: newUserAccount.$id,
        email:email,
        firstname:firstName,
        lastname:lastName,
        fitnessGoals: fitnessGoals || 'basic',
        membershipType: membershipType || 'free',
        createdAt: new Date().toISOString(),
      }
    );

    // Create session for the new user
    const session = await account.createEmailPasswordSession(email, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === 'production',
    });

    return parseStringify(newUser);
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

/**
 * Get the currently logged in user
 */
export async function getLoggedInUser() {
  try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({ userId: result.$id });

    return parseStringify(user);
  } catch (error) {
    console.log('Not logged in:', error);
    return null;
  }
}

/**
 * Log out the current user
 */
export const logoutAccount = async () => {
  try {
    const { account } = await createSessionClient();

    (await cookies()).delete('appwrite-session');

    await account.deleteSession('current');
    
    revalidatePath('/');
    
    return { success: true };
  } catch (error) {
    console.error('Error logging out:', error);
    return { success: false };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async ({
  userId,
  firstName,
  lastName,
  fitnessGoals,
  membershipType,
  profileImage
}: {
  userId: string;
  firstName?: string;
  lastName?: string;
  fitnessGoals?: string[];
  membershipType?: string;
  profileImage?: string;
}) => {
  try {
    const { database } = await createAdminClient();
    
    const user = await getUserInfo({ userId });
    
    if (!user) throw new Error('User not found');
    
    const updatedUser = await database.updateDocument(
      DATABASE_ID,
      USERS_COLLECTION_ID,
      user.$id,
      {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        fitnessGoals: fitnessGoals || user.fitnessGoals,
        membershipType: membershipType || user.membershipType,
        profileImage: profileImage || user.profileImage,
        updatedAt: new Date().toISOString()
      }
    );
    
    revalidatePath('/profile');
    
    return parseStringify(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
