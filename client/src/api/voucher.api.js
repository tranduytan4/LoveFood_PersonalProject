import { http } from "./http";

export const voucherApi = {
  getActive: () => http.get("/vouchers/active"),
  apply: (code, subtotal) => http.post("/vouchers/apply", { code, subtotal }),
};
