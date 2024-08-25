import { Router } from "express";
import {

    adminLogin,
    loginUser,
    logOutUser,
    refreshAccessToken,
    registerUser,
} from "../controllers/auth.controller.js";
import { verifyJWTUser } from "../middelwares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//admin Login
router.route("/admin-login").post(adminLogin);

//secured Routes only for authenticated user

router.route("/logout").post(verifyJWTUser, logOutUser);
router.route("/refresh-token").post(verifyJWTUser, refreshAccessToken);

export default router;
