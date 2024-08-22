import { Router } from "express";
import {
   
    adminLogin,
    loginUser,
    logOutUser,
    refreshAccessToken,
    registerUser,
} from "../controllers/auth.controller.js";
import { varifyJWTUser } from "../middelwares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

//admin Login
router.route("/admin-login").post(adminLogin);

//secured Routes

router.route("/logout").post(varifyJWTUser, logOutUser);
router.route("/refresh-token").post(varifyJWTUser, refreshAccessToken);

export default router;
