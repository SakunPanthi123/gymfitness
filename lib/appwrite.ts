"use server";

import { Client, Account, Databases } from 'node-appwrite';
import { cookies } from 'next/headers';

// Environment variables
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';
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