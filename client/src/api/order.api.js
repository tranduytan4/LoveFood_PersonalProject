import { http } from "./http";

export const orderApi = {
  create: (orderData) => http.post("/orders", orderData),
  getMyOrders: () => http.get("/orders/my-orders"),
  trackByCode: (orderCode) => http.get(`/orders/track/${orderCode}`),
};
