import { http } from "./http";

export const productApi = {
  getList: (params) => http.get("/products", { params }),
  getBySlug: (slug) => http.get(`/products/${slug}`),
};
