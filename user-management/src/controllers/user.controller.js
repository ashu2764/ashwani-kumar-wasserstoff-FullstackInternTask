import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { error } from "console";
import mongoose from "mongoose";

// GET ALL USERS ONLY ACCESS TO ADMIN
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password -refreshToken");

    if (!users) {
        throw new ApiError(500, "Server error: Cannot fetch users");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { users }, "All users fetched successfully"));
});

// GET USER BY ID ACCESS BY LOGIN USER
const getUserByID = asyncHandler(async (req, res) => {
    const userId  = req.params.id;

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

// UPDATE USER PASSWORD
const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "password chanege successfully"));
});

// DELETE USER
const deleteUser = asyncHandler(async (req, res) => {
    const userId  = req.params.id;

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    await User.findByIdAndDelete(userId);

    return res
        .status(200)
        .json(new ApiResponse(200, "User deleted successfully"));
});


//Get current user Details
const getCurrentUser = asyncHandler(async(req,res)=>{

    //Find current user , jwt Verified 
    const user = await User.find(req.user._id).select("-password -refreshToken")

    return res
    .status(200)
    .json(
        new ApiResponse(
            201, user, "current user fetched successfully"
        )
    )
})



export { getAllUsers, getUserByID, changeCurrentPassword, deleteUser, getCurrentUser};
