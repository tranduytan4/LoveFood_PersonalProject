const router = require("express").Router();
const {
  getAddresses,
  createAddress,
  setDefaultAddress,
  deleteAddress,
} = require("../controllers/address.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.use(authMiddleware);

router.get("/", getAddresses);
router.post("/", createAddress);
router.patch("/:id/default", setDefaultAddress);
router.delete("/:id", deleteAddress);

module.exports = router;
