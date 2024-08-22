import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

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
    console.log(userId)

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { user }, "User fetched successfully"));
});

// UPDATE USER PASSWORD
const updateUser = asyncHandler(async (req, res) => {
    const userId  = req.params.id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Check if the old password is correct
    const isMatch = await user.isPasswordCorrect(oldPassword);
    if (!isMatch) {
        throw new ApiError(400, "Old password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res
        .status(200)
        .json(new ApiResponse(200, "Password updated successfully"));
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

export { getAllUsers, getUserByID, updateUser, deleteUser };
