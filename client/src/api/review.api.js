import { http } from "./http";

export const reviewApi = {
  getByProduct: (productId) => http.get(`/reviews/product/${productId}`),
  create: (reviewData) => http.post("/reviews", reviewData),
};
