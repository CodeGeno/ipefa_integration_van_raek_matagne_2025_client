"use server";

import { cookies } from "next/headers";
import { getCookie as getClientCookie } from "cookies-next/client";

// Fonction côté serveur pour récupérer les cookies
// Construire manuellement la chaîne de cookies
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

    try {
      getClientCookie("token");
    } catch {}
  } catch {}

  return headers;
};
