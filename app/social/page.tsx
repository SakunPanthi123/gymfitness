"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, Heart, MessageCircle, Share, Trophy, Target } from "lucide-react";

export default function SocialPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Community</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Connect with other fitness enthusiasts and share your journey
          </p>
        </div>

        {/* Coming Soon */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <Users className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
            <CardTitle className="text-2xl">Community Features Coming Soon!</CardTitle>
            <CardDescription className="text-lg">
              Join a supportive community of fitness enthusiasts
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Share className="h-4 w-4" />
                <span>Share workouts and achievements</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Heart className="h-4 w-4" />
                <span>Follow friends and get motivated</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>Comment and support each other</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm text-gray-600">
                <Trophy className="h-4 w-4" />
                <span>Participate in challenges and leaderboards</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <p className="text-gray-500">
                Focus on your fitness goals while we build the community:
              </p>
              <div className="flex gap-3 justify-center">
                <Button asChild>
                  <Link href="/progress">
                    <Target className="h-4 w-4 mr-2" />
                    Track Progress
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/goals">
                    <Trophy className="h-4 w-4 mr-2" />
                    Set Goals
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}