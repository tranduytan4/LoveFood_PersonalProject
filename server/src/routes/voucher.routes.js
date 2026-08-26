const router = require("express").Router();
const { getActiveVouchers, applyVoucher } = require("../controllers/voucher.controller");

router.get("/active", getActiveVouchers);
router.post("/apply", applyVoucher);

module.exports = router;
