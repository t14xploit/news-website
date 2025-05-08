"use server";

import { cookies } from "next/headers";

const cookieName = "cookie_consent";

export async function getCookieConsent() {
  const cookieStore = await cookies();
  const consentCookie = cookieStore.get(cookieName);

  if (consentCookie?.value) {
    return consentCookie.value; // Return 'accepted' or 'declined'
  }

  return null; // No consent yet
}

// Function to set the user's cookie consent status
export async function setCookieConsent(consent: "accepted" | "declined") {
  const cookieStore = await cookies();
  cookieStore.set(cookieName, consent, {
    httpOnly: true,
    expires: new Date().setDate(new Date().getDate() + 30), // Cookie expires in 30 days
  });
}
