import { Router } from "express";
import {varifyJWTUser, verifyJWTAdmin } from "../middelwares/auth.middleware.js";
import { deleteUser, getAllUsers, getUserByID, updateUser } from "../controllers/user.controller.js";

const router = Router();

// Admin accessible routes
router.route("/").get(verifyJWTAdmin, getAllUsers);

// User routes
router.route("/:id")
    .get(varifyJWTUser, getUserByID)
    .put(varifyJWTUser, updateUser)
    .delete(varifyJWTUser, deleteUser);

export default router;
