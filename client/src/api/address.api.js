import { http } from "./http";

export const addressApi = {
  getAll: () => http.get("/addresses"),
  create: (addressData) => http.post("/addresses", addressData),
  setDefault: (id) => http.patch(`/addresses/${id}/default`),
  delete: (id) => http.delete(`/addresses/${id}`),
};
