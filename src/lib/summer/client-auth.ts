import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  SUMMER_CLIENT_ACCESS_COOKIE,
  SUMMER_CLIENT_REFRESH_COOKIE,
} from "@/lib/summer/admin-constants";
import {
  fetchSupabaseAuth,
  getSummerSupabaseConfig,
  hasSummerSupabasePublicConfig,
  selectSummerSingle,
  upsertSummerRows,
} from "@/lib/summer/supabase";
import type { SummerClient } from "@/lib/summer/types";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  user: { id: string; email?: string };
};

export type SummerClientSession = {
  accessToken: string;
  refreshToken?: string;
  authUser: { id: string; email?: string };
  client: SummerClient;
};

async function upsertClientRow(authUserId: string, email: string, fullName?: string | null) {
  const existing = await selectSummerSingle<SummerClient>("clients", {
    or: `(auth_user_id.eq.${authUserId},email.eq.${email})`,
  });
  if (existing) {
    if (!existing.auth_user_id) {
      // Link an existing email-only client row to its new auth user.
      await upsertSummerRows<SummerClient>(
        "clients",
        [{ ...existing, auth_user_id: authUserId }],
        "id",
      );
    }
    return existing;
  }
  const rows = await upsertSummerRows<SummerClient>(
    "clients",
    [
      {
        auth_user_id: authUserId,
        email,
        full_name: fullName || null,
        lifecycle_status: "client",
      },
    ],
    "email",
  );
  return rows?.[0] || null;
}

function setClientCookies(access: string, refresh: string) {
  return cookies().then(async (store) => {
    store.set(SUMMER_CLIENT_ACCESS_COOKIE, access, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    store.set(SUMMER_CLIENT_REFRESH_COOKIE, refresh, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  });
}

export async function signupClient(email: string, password: string, fullName?: string) {
  if (!hasSummerSupabasePublicConfig()) {
    throw new Error("Supabase configuration is missing.");
  }
  const session = await fetchSupabaseAuth<AuthResponse>("/auth/v1/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, data: { full_name: fullName || null } }),
    keyKind: "anon",
  });
  const normalizedEmail = session.user.email?.toLowerCase();
  if (!normalizedEmail) throw new Error("Supabase did not return an email.");
  const client = await upsertClientRow(session.user.id, normalizedEmail, fullName);
  if (!client) throw new Error("Could not create client record.");
  await setClientCookies(session.access_token, session.refresh_token);
  return { accessToken: session.access_token, refreshToken: session.refresh_token, authUser: session.user, client };
}

export async function loginClient(email: string, password: string) {
  if (!hasSummerSupabasePublicConfig()) {
    throw new Error("Supabase configuration is missing.");
  }
  const session = await fetchSupabaseAuth<AuthResponse>("/auth/v1/token?grant_type=password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    keyKind: "anon",
  });
  const normalizedEmail = session.user.email?.toLowerCase();
  if (!normalizedEmail) throw new Error("Supabase did not return an email.");
  let client = await selectSummerSingle<SummerClient>("clients", {
    email: `eq.${normalizedEmail}`,
  });
  if (!client) {
    client = await upsertClientRow(session.user.id, normalizedEmail);
  }
  if (!client) throw new Error("No client account found for this email.");
  await setClientCookies(session.access_token, session.refresh_token);
  return { accessToken: session.access_token, refreshToken: session.refresh_token, authUser: session.user, client };
}

export async function clearClientSession() {
  const store = await cookies();
  store.delete(SUMMER_CLIENT_ACCESS_COOKIE);
  store.delete(SUMMER_CLIENT_REFRESH_COOKIE);
}

export async function getClientSession(): Promise<SummerClientSession | null> {
  if (!hasSummerSupabasePublicConfig()) return null;
  const store = await cookies();
  const accessToken = store.get(SUMMER_CLIENT_ACCESS_COOKIE)?.value;
  if (!accessToken) return null;
  try {
    const { anonKey, url } = getSummerSupabaseConfig();
    if (!url || !anonKey) return null;
    const res = await fetch(new URL("/auth/v1/user", url), {
      headers: { apikey: anonKey, Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const user = (await res.json()) as { id: string; email?: string };
    if (!user.email) return null;
    const client = await selectSummerSingle<SummerClient>("clients", {
      email: `eq.${user.email.toLowerCase()}`,
    });
    if (!client) return null;
    return {
      accessToken,
      refreshToken: store.get(SUMMER_CLIENT_REFRESH_COOKIE)?.value,
      authUser: user,
      client,
    };
  } catch {
    return null;
  }
}

export async function requireClientSession() {
  const session = await getClientSession();
  if (!session) redirect("/client/login");
  return session;
}
