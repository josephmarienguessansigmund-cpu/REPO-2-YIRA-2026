// Définition des routes de l'API
export const endpoints = {
  filieres: {
    list: '/filieres',
  },
  carte: {
    get: (code: string) => `/carte/${code}`,
    creer: '/carte/creer',
  },
  ia: {
    orientation: '/ia/orientation',
    coaching: '/ia/coaching',
  },
};

/**
 * Récupère la liste des filières via l'API.
 * Cette fonction est exportée pour être utilisée dans les Server Components.
 */
export async function getFilieres(pays?: string) {
  // On utilise le pays passé en paramètre ou la constante TENANT (ex: "CI")
  // Assurez-vous que 'api' et 'TENANT' sont bien importés ou définis plus haut dans ce fichier.
  const tenantId = pays ?? (typeof TENANT !== 'undefined' ? TENANT : 'CI');
  
  try {
    const response = await api.get(`${endpoints.filieres.list}?pays=${tenantId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des filières:", error);
    return [];
  }
}