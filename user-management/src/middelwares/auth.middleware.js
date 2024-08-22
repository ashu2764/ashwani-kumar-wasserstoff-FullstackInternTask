import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";


// this is the middleware for user authentication
export const varifyJWTUser = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decodedToken?._id).select(
            "-password, -refreshToken"
        );

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token");
    }
});

//This middeleare is for Admin authorization

export const verifyJWTAdmin = asyncHandler(async (req, res, next) => {
    let token;

    // Check if Authorization header exists and starts with "Bearer"
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract the token from the Authorization header
            token = req.headers.authorization.split(' ')[1];

            // Verify the token
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

            // Check if the user has admin rights
            if (!decoded.isAdmin) {
                return next(new ApiError(403, "Not authorized as Admin")); // Use 403 Forbidden for authorization issues
            }

            // Attach decoded information to req object for use in route handlers
            req.user = decoded;

            next();
        } catch (error) {
            return next(new ApiError(401, "Not authorized, token failed")); // Use 401 Unauthorized for token issues
        }
    } else {
        return next(new ApiError(401, "No token provided")); // Handle missing token
    }
});
