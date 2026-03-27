import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SUMMER_ADMIN_ACCESS_COOKIE, SUMMER_ADMIN_REFRESH_COOKIE } from "@/lib/summer/admin-constants";
import {
  fetchSupabaseAuth,
  getSummerSupabaseConfig,
  hasSummerSupabaseAdminConfig,
  selectSummerSingle,
  upsertSummerRows,
} from "@/lib/summer/supabase";
import type { SummerAdminUser } from "@/lib/summer/types";

type PasswordAuthResponse = {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email?: string;
  };
};

type SupabaseAuthUser = {
  id: string;
  email?: string;
};

export type SummerAdminSession = {
  accessToken: string;
  refreshToken?: string;
  user: SupabaseAuthUser;
  adminUser: SummerAdminUser;
};

async function getAdminUserByEmail(email: string) {
  return selectSummerSingle<SummerAdminUser>("admin_users", { email: `eq.${email}` });
}

async function maybeBootstrapAdmin(email: string) {
  const bootstrapEmail = process.env.SUMMER_BOOTSTRAP_ADMIN_EMAIL;

  if (!bootstrapEmail || bootstrapEmail.toLowerCase() !== email.toLowerCase()) {
    return null;
  }

  const rows = await upsertSummerRows<SummerAdminUser>(
    "admin_users",
    [{ email, role: "admin" }],
    "email",
  );

  return rows?.[0] || null;
}

export async function loginSummerAdmin(email: string, password: string) {
  if (!hasSummerSupabaseAdminConfig()) {
    throw new Error("Supabase admin configuration is missing.");
  }

  const session = await fetchSupabaseAuth<PasswordAuthResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    keyKind: "anon",
  });

  const normalizedEmail = session.user.email?.toLowerCase();

  if (!normalizedEmail) {
    throw new Error("Supabase did not return an email for this account.");
  }

  let adminUser = await getAdminUserByEmail(normalizedEmail);

  if (!adminUser) {
    adminUser = await maybeBootstrapAdmin(normalizedEmail);
  }

  if (!adminUser) {
    throw new Error("This account is not authorized for Summer admin.");
  }

  const cookieStore = await cookies();
  cookieStore.set(SUMMER_ADMIN_ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  cookieStore.set(SUMMER_ADMIN_REFRESH_COOKIE, session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });

  return {
    accessToken: session.access_token,
    refreshToken: session.refresh_token,
    user: session.user,
    adminUser,
  } satisfies SummerAdminSession;
}

export async function clearSummerAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SUMMER_ADMIN_ACCESS_COOKIE);
  cookieStore.delete(SUMMER_ADMIN_REFRESH_COOKIE);
}

export async function getSummerAdminSession(): Promise<SummerAdminSession | null> {
  if (!hasSummerSupabaseAdminConfig()) {
    return null;
  }

  const cookieStore = await cookies();
  const accessToken = cookieStore.get(SUMMER_ADMIN_ACCESS_COOKIE)?.value;
  const refreshToken = cookieStore.get(SUMMER_ADMIN_REFRESH_COOKIE)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const { anonKey, url } = getSummerSupabaseConfig();

    if (!url || !anonKey) {
      return null;
    }

    const response = await fetch(new URL("/auth/v1/user", url), {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const user = (await response.json()) as SupabaseAuthUser;

    if (!user.email) {
      return null;
    }

    const adminUser = await getAdminUserByEmail(user.email.toLowerCase());

    if (!adminUser) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
      user,
      adminUser,
    };
  } catch {
    return null;
  }
}

export async function requireSummerAdminSession() {
  const session = await getSummerAdminSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}
