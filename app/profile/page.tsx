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