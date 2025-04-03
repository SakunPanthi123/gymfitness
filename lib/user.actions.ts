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

const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || '';
const USERS_COLLECTION_ID = process.env.NEXT_PUBLIC_USERS_COLLECTION_ID || '';

if (!DATABASE_ID || !USERS_COLLECTION_ID) {
  console.error('Missing database environment variables');
}
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