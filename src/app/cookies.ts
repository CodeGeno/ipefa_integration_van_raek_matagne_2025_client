"use server";

import { cookies } from "next/headers";
import { getCookie as getClientCookie } from "cookies-next/client";

// Fonction côté serveur pour récupérer les cookies
export const getCookieString = async (): Promise<Headers> => {
  const cookieStore = await cookies();
  const headers = new Headers();

  try {
    // Build cookie string manually
    const cookieString = cookieStore
      .getAll()
      .map(({ name, value }) => `${name}=${value}`)
      .join("; ");

    if (cookieString) {
      headers.set("Cookie", cookieString);
    }

    // Essayons de récupérer le token côté client si possible
    try {
      getClientCookie("token");
    } catch {}
  } catch {}

  return headers;
};
