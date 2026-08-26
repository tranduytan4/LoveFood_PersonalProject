const router = require("express").Router();
const { register, login, getProfile, updateProfile } = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
