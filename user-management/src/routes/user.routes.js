import { Router } from "express";
import {verifyJWTUser, verifyJWTAdmin } from "../middelwares/auth.middleware.js";
import { deleteUser, getAllUsers, getUserByID, changeCurrentPassword, getCurrentUser } from "../controllers/user.controller.js";

const router = Router();

// Admin accessible routes
router.route("/").get(verifyJWTAdmin, getAllUsers);

// User routes
//get current user
router.route("/getCurrentUser").get(verifyJWTUser, getCurrentUser)

//get, upate , delete user by id only for authenticated user
router.route("/:id")
    .get(verifyJWTUser, getUserByID)
    .put(verifyJWTUser, changeCurrentPassword)
    .delete(verifyJWTUser, deleteUser);





export default router;
