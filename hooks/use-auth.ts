"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
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