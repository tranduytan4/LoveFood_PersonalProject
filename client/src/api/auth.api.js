import { http } from "./http";

export const authApi = {
  login: (credentials) => http.post("/auth/login", credentials),
  register: (userData) => http.post("/auth/register", userData),
  getProfile: () => http.get("/auth/profile"),
  updateProfile: (profileData) => http.put("/auth/profile", profileData),
};
