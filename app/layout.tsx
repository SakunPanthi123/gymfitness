import { Toaster } from "sonner";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Activity, 
  TrendingUp, 
  UserCircle, 
  Dumbbell, 
  Apple, 
  Target,
  Calendar,
  Trophy,
  Users,
  Settings
} from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="overscroll-none">
        <QueryProvider>
          {/* Navigation Bar */}
          <header className="sticky top-0 z-20 bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
              <Button variant="ghost" asChild>
                <Link href="/">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-6 w-6 text-emerald-500" />
                    <span className="font-bold text-xl">GymFitness</span>
                  </div>
                </Link>
              </Button>

              <nav className="hidden lg:flex items-center space-x-1">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/workouts">
                    <Dumbbell className="h-4 w-4 mr-2" />
                    Workouts
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/nutrition">
                    <Apple className="h-4 w-4 mr-2" />
                    Nutrition
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/progress">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Progress
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/goals">
                    <Target className="h-4 w-4 mr-2" />
                    Goals
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/planner">
                    <Calendar className="h-4 w-4 mr-2" />
                    Planner
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/social">
                    <Users className="h-4 w-4 mr-2" />
                    Community
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/profile">
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
              </nav>

              {/* Mobile menu button */}
              <Button variant="outline" size="icon" className="lg:hidden">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              </Button>
            </div>
          </header>
          <Toaster />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
