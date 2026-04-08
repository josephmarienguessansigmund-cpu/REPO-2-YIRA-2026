const API_URL = process.env.NEXT_PUBLIC_API_URL;
const TENANT = process.env.NEXT_PUBLIC_TENANT ?? "ci";

async function request(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "X-Tenant-ID": TENANT,
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

export const api = {
  get: (path: string) => request(path),
  post: (path: string, body: any) => request(path, { method: "POST", body: JSON.stringify(body) }),
  patch: (path: string, body: any) => request(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: "DELETE" }),
};

export const endpoints = {
  health: "/health",
  auth: {
    login: "/auth/conseiller/login",
    inscription: "/auth/beneficiaire/inscription",
    profil: "/auth/profil",
    loginDrh: "/auth/drh/login",
    loginAdmin: "/auth/admin/login",
  },
  evaluation: {
    init: "/evaluation/init",
    soumettre: "/evaluation/soumettre",
    resultats: (id: string) => `/evaluation/${id}/resultats`,
  },
  affectation: {
    orienter: "/affectation/orienter",
    etablissements: (famille: string) => `/affectation/etablissements/${famille}`,
  },
  messagerie: {
    conversations: "/messagerie/conversations",
    messages: (id: string) => `/messagerie/${id}/messages`,
    envoyer: (id: string) => `/messagerie/${id}/envoyer`,
    interet: (id: string) => `/messagerie/${id}/interet`,
  },
  admin: {
    dashboard: "/admin/dashboard",
    beneficiaires: "/carte/debug/beneficiaires",
  },
  carte: {
    get: (code: string) => `/carte/${code}`,
    creer: "/carte/creer",
  },
  ia: {
    orientation: "/ia/orientation",
    rapport: "/ia/rapport",
    pii: "/ia/pii",
    coaching: "/ia/coaching",
  },
  ussd: "/ussd",
  sms: {
    inscription: "/sms/inscription",
  },
};