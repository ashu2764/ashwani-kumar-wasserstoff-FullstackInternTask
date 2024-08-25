import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { fetchUserData } from "../utils/fetchUserData.js";


const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET

export const verifyJWTUser = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;

    if(!header || !header.startsWith('Bearer')){
        throw new ApiError(402, "No token provide, authorization denied")
    }

    const token = header.split(' ')[1];
    try {
        // verify the token locally first
        const decoded = jwt.verify(token, JWT_SECRET);

        //fetch user details from the User Management Service

        const userDate = await fetchUserData(token);

        //attch the decode user data to the object

        req.user = {...decoded.user, ...userDate}
        next();
    } catch (error) {
        throw new ApiError(401, error, "Token is not valid or failed to fetch user data")
        
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
