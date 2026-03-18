import { http } from "./http";

export const categoryApi = {
  getAll: () => http.get("/categories"),
};
