/**
 * Génère une URL avec des paramètres de recherche
 * @param baseUrl - L'URL de base sans paramètres
 * @param params - Un objet contenant les paramètres à ajouter
 * @returns L'URL complète avec les paramètres
 */
export function createUrlWithParams(
  baseUrl: string,
  params: Record<string, string | number | undefined>
): string {
  // Filtrer les paramètres non définis ou vides
  const filteredParams = Object.entries(params).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ""
  );

  // Si aucun paramètre valide, retourner l'URL de base
  if (filteredParams.length === 0) {
    return baseUrl;
  }

  // Ajouter ? à l'URL si elle n'en contient pas déjà un
  const separator = baseUrl.includes("?") ? "&" : "?";

  // Construire la chaîne de paramètres
  const queryString = filteredParams
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value!)}`
    )
    .join("&");

  return `${baseUrl}${separator}${queryString}`;
}
