import { http } from "./http";

export const productApi = {
  getList: (params) => http.get("/products", { params }),
  getPopular: (limit = 9) => http.get("/products/popular", { params: { limit } }),
  getDeals: (limit = 12) => http.get("/products/deals", { params: { limit } }),
  getBySlug: (slug) => http.get(`/products/${slug}`),
};
