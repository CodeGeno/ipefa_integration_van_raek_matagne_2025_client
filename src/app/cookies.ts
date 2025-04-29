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
      console.log("Cookies du serveur:", cookieString);
      headers.set("Cookie", cookieString);
    } else {
      console.log("Aucun cookie trouvé côté serveur");
    }

    // Essayons de récupérer le token côté client si possible
    try {
      const clientToken = getClientCookie("token");
      if (clientToken) {
        console.log("Token client trouvé:", clientToken);
      } else {
        console.log("Aucun token côté client");
      }
    } catch (e) {
      console.log(
        "Impossible de lire les cookies côté client depuis le serveur"
      );
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des cookies:", error);
  }

  return headers;
};
