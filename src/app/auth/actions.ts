"use server";

import { revalidatePath } from "next/cache";
import { createServersideClient, createServersideAdminClient } from "@/utils/supabase/server";

function getBaseUrl(): string {
  // use VERCEL_URL for production and preview deployments
  // fallback to BASE_URL for local development
  const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL;
  console.log("Base URL:", baseUrl);
  if (!baseUrl) {
    throw new Error("BASE_URL is not defined");
  }

  return baseUrl;
}

// login
export async function login(data: { email: string; password: string }): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createServersideClient();
  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { error: (error as Error).message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// is email registered to an existing user
export async function isEmailRegistered(email: string): Promise<boolean> {
  const supabase = await createServersideAdminClient();
  const { data, error } = await supabase.rpc("check_user_exists_by_email", {
    email_param: email.toLowerCase(),
  });

  if (error) throw error;

  const userExists = data && data.length > 0 && data[0].user_exists;

  return userExists;
}

// signup
export async function signup(data: {
  email: string;
  password: string;
}): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createServersideClient();
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${getBaseUrl()}/auth/login`,
    },
  });

  if (error) {
    return { error: (error as Error).message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

// send password recovery email
export async function sendPasswordRecovery(email: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createServersideClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getBaseUrl()}/auth/update-password`,
  });

  if (error) {
    return { error: (error as Error).message };
  }

  return { success: true };
}

// update password
export async function updatePassword(newPassword: string): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createServersideClient();
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: (error as Error).message };
  }

  return { success: true };
}

// logout
export async function logout() {
  const supabase = await createServersideClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: (error as Error).message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
