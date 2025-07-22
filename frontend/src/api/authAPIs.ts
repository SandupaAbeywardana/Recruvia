import { api, apiPrivate } from "@/api/apiBase";

const authAPIs = {
  login: (data: { email: string, password: string }) =>
    api.post("/login", data),

  register: (data: {
    name: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: "employer" | "candidate",
    company_name?: string,
  }) => api.post("/register", data),

  logout: () => apiPrivate.post("/logout"),

  getCurrentUser: () => apiPrivate.get("/me"),
};

export default authAPIs;
