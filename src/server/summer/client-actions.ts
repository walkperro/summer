"use server";

import { redirect } from "next/navigation";

import { clearClientSession, loginClient, signupClient } from "@/lib/summer/client-auth";

function stringValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function clientSignupAction(formData: FormData) {
  const email = stringValue(formData.get("email")).toLowerCase();
  const password = stringValue(formData.get("password"));
  const fullName = stringValue(formData.get("full_name"));

  if (!email || !password) {
    redirect("/client/signup?error=Missing%20email%20or%20password");
  }

  try {
    await signupClient(email, password, fullName || undefined);
    redirect("/client");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create account.";
    redirect(`/client/signup?error=${encodeURIComponent(message)}`);
  }
}

export async function clientLoginAction(formData: FormData) {
  const email = stringValue(formData.get("email")).toLowerCase();
  const password = stringValue(formData.get("password"));

  if (!email || !password) {
    redirect("/client/login?error=Missing%20email%20or%20password");
  }

  try {
    await loginClient(email, password);
    redirect("/client");
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to sign in.";
    redirect(`/client/login?error=${encodeURIComponent(message)}`);
  }
}

export async function clientLogoutAction() {
  await clearClientSession();
  redirect("/");
}
