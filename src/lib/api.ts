const BASE_URL = "/api";

export function getToken(): string | null {
  return localStorage.getItem("clinic_token");
}

export function setToken(token: string) {
  localStorage.setItem("clinic_token", token);
}

export function getRefreshToken(): string | null {
  return localStorage.getItem("clinic_refresh_token");
}

export function setRefreshToken(token: string) {
  localStorage.setItem("clinic_refresh_token", token);
}

export function removeToken() {
  localStorage.removeItem("clinic_token");
  localStorage.removeItem("clinic_refresh_token");
  localStorage.removeItem("clinic_role");
  localStorage.removeItem("clinic_user");
}

export function getRole(): string | null {
  return localStorage.getItem("clinic_role");
}

export function setRole(role: string) {
  localStorage.setItem("clinic_role", role);
}

export function setUser(user: any) {
  localStorage.setItem("clinic_user", JSON.stringify(user));
}

export function getUser(): any | null {
  const u = localStorage.getItem("clinic_user");
  if (!u || u === "undefined" || u === "null") return null;
  try {
    return JSON.parse(u);
  } catch {
    return null;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> || {}),
  };

  if (auth) {
    const token = getToken();
    if (token) {
      headers["access_token"] = token;
    } else {
      console.warn("Auth required but no token found");
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `Request failed: ${res.status}`);
  }
  return data;
}

// ── Public endpoints ──────────────────────────────────────────────────
export const api = {
  // About Us
  getAboutUs: () => request<any>("/about/us"),

  // Additional Info
  getAdditionalInfo: () => request<any>("/additional/info"),

  // Branches
  getBranches: () => request<any>("/branch"),
  getBranch: (id: number) => request<any>(`/branch/${id}`),

  // Contacts
  getContacts: () => request<any>("/contact"),

  // Doctors
  getDoctors: () => request<any>("/doctor"),
  getDoctor: (id: string) => request<any>(`/doctor/${id}`),

  // Feedback
  getApprovedFeedbacks: () => request<any>("/feedback/approved"),
  leaveFeedback: (data: { phone_number: string; email: string; full_name: string; content: string }) =>
    request<any>("/feedback", { method: "POST", body: JSON.stringify(data) }),

  // Gallery
  getGallery: () => request<any>("/gallery"),
  getOneGallery: (id: number) => request<any>(`/gallery/${id}`),

  // News
  getNews: () => request<any>("/news"),
  getOneNews: (id: number) => request<any>(`/news/${id}`),

  // Statistics
  getStatistics: () => request<any>("/statistics"),

  // Patient (public create)
  createPatient: (formData: FormData) =>
    request<any>("/patient", { method: "POST", body: formData }),

  // Auth
  adminLogin: (credentials: { username: string; password: string }) =>
    request<any>("/admin/login", { method: "POST", body: JSON.stringify(credentials) }),

  receptionLogin: (credentials: { username: string; password: string }) =>
    request<any>("/reception/login", { method: "POST", body: JSON.stringify(credentials) }),

  // ── Admin-only endpoints ───────────────────────────────────────────
  admin: {
    getProfile: () => request<any>("/admin/profile", {}, true),
    getAdmins: () => request<any>("/admin", {}, true),
    createAdmin: (data: any) => request<any>("/admin/create", { method: "POST", body: JSON.stringify(data) }, true),
    editUsername: (data: any) => request<any>("/admin/edit-username", { method: "PATCH", body: JSON.stringify(data) }, true),
    editPassword: (data: any) => request<any>("/admin/edit-password", { method: "PATCH", body: JSON.stringify(data) }, true),

    // About
    createAbout: (data: any) => request<any>("/about/us", { method: "POST", body: JSON.stringify(data) }, true),
    editAbout: (id: number, data: any) => request<any>(`/about/us/${id}`, { method: "PATCH", body: JSON.stringify(data) }, true),
    deleteAbout: (id: number) => request<any>(`/about/us/${id}`, { method: "DELETE" }, true),

    // Additional Info
    createInfo: (data: any) => request<any>("/additional/info", { method: "POST", body: JSON.stringify(data) }, true),
    editInfo: (id: number, data: any) => request<any>(`/additional/info/${id}`, { method: "PATCH", body: JSON.stringify(data) }, true),
    deleteInfo: (id: number) => request<any>(`/additional/info/${id}`, { method: "DELETE" }, true),

    // Branches
    createBranch: (formData: FormData) =>
      request<any>("/branch", { method: "POST", body: formData }, true),
    editBranch: (id: number, formData: FormData) =>
      request<any>(`/branch/${id}`, { method: "PATCH", body: formData }, true),
    deleteBranch: (id: number) => request<any>(`/branch/${id}`, { method: "DELETE" }, true),

    // Contacts
    createContact: (data: any) => request<any>("/contact", { method: "POST", body: JSON.stringify(data) }, true),
    editContact: (id: number, data: any) => request<any>(`/contact/${id}`, { method: "PATCH", body: JSON.stringify(data) }, true),
    deleteContact: (id: number) => request<any>(`/contact/${id}`, { method: "DELETE" }, true),

    // Doctors
    createDoctor: (formData: FormData) =>
      request<any>("/doctor", { method: "POST", body: formData }, true),
    editDoctor: (id: string, formData: FormData) =>
      request<any>(`/doctor/${id}`, { method: "PATCH", body: formData }, true),
    deleteDoctor: (id: string) => request<any>(`/doctor/${id}`, { method: "DELETE" }, true),

    // Feedback
    getAllFeedbacks: () => request<any>("/feedback", {}, true),
    approveFeedback: (id: number) => request<any>(`/feedback/${id}/approve`, { method: "PATCH" }, true),
    deleteFeedback: (id: number) => request<any>(`/feedback/${id}`, { method: "DELETE" }, true),

    // Gallery
    createGallery: (formData: FormData) =>
      request<any>("/gallery", { method: "POST", body: formData }, true),
    updateGallery: (id: number, formData: FormData) =>
      request<any>(`/gallery/${id}`, { method: "PATCH", body: formData }, true),
    deleteGallery: (id: number) => request<any>(`/gallery/${id}`, { method: "DELETE" }, true),

    // News
    createNews: (formData: FormData) =>
      request<any>("/news", { method: "POST", body: formData }, true),
    updateNews: (id: number, formData: FormData) =>
      request<any>(`/news/${id}`, { method: "PATCH", body: formData }, true),
    deleteNews: (id: number) => request<any>(`/news/${id}`, { method: "DELETE" }, true),

    // Statistics
    createStat: (data: any) => request<any>("/statistics", { method: "POST", body: JSON.stringify(data) }, true),
    editStat: (id: number, data: any) => request<any>(`/statistics/${id}`, { method: "PUT", body: JSON.stringify(data) }, true),
    deleteStat: (id: number) => request<any>(`/statistics/${id}`, { method: "DELETE" }, true),

    // Receptions
    getReceptions: () => request<any>("/reception", {}, true),
    getOneReception: (id: string) => request<any>(`/reception/${id}`, {}, true),
    createReception: (formData: FormData) =>
      request<any>("/reception", { method: "POST", body: formData }, true),
    deleteReception: (id: string) => request<any>(`/reception/${id}`, { method: "DELETE" }, true),
  },

  // ── Reception endpoints ────────────────────────────────────────────
  reception: {
    getProfile: () => request<any>("/reception/profile/me", {}, true),
    editProfile: (formData: FormData) =>
      request<any>("/reception/profile/me", { method: "PATCH", body: formData }, true),
    editUsername: (data: any) => request<any>("/reception/edit-username", { method: "PATCH", body: JSON.stringify(data) }, true),
    editPassword: (data: any) => request<any>("/reception/edit-password", { method: "PATCH", body: JSON.stringify(data) }, true),
    getPatients: () => request<any>("/patient", {}, true),
    getHistory: () => request<any>("/patient/history", {}, true),
    getPatient: (id: string) => request<any>(`/patient/${id}`, {}, true),
    deletePatient: (id: string) => request<any>(`/patient/${id}`, { method: "DELETE" }, true),
    getAllFeedbacks: () => request<any>("/feedback", {}, true),
  },
};

export const MEDIA_BASE = BASE_URL;

// Helper function to get full media URL
export function getMediaUrl(path: string | null | undefined): string {
  if (!path) {
    console.log("getMediaUrl: path is null/undefined");
    return "";
  }
  if (path.startsWith("http://") || path.startsWith("https://")) {
    console.log("getMediaUrl: already full URL:", path);
    return path;
  }
  const fullUrl = `${MEDIA_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  console.log("getMediaUrl: converting", path, "to", fullUrl);
  return fullUrl;
}
