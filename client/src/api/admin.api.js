import { http } from "./http";

export const adminApi = {
  getStats: () => http.get("/admin/stats"),
  getOrders: (params) => http.get("/admin/orders", { params }),
  updateOrderStatus: (id, status, note) =>
    http.patch(`/admin/orders/${id}/status`, { status, note }),
  toggleProductStock: (id) => http.patch(`/admin/products/${id}/toggle-stock`),
};
