import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";



//function for generate accessAndRefreshTokens
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access token"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    //This logic is for check all fileds are come from body 
    if ([email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }


    //Check for if User with email, username is Already Existed in the Db. 
    const existedUser = await User.findOne({
        $or: [{ username }, { email }], //user $or  to find one .if one of them is identical then user id aleady exists
    });


    //if user Exsist then throm error
    if (existedUser) {
        throw new ApiError(
            409,
            "User with this email or username is already existed"
        );
    }
    
    //if everyThing is ok then create user
    const user = await User.create({
        email,
        username: username.toLowerCase(),
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    //ckeck for user is created or not
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating the user");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User Registered Successfully")
        );
});


//controller for login the registered user
const loginUser = asyncHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if (!(username || email)) {
        throw new ApiError(400, "Username or password is required");
    }

    const user = await User.findOne({
        $or: [{ email }, { username }],
    });

    if (!user) {
        throw new ApiError(404, "User does not exists");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user crediantials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken,
                },
                "User Logged In Successfully"
            )
        );
});


//Controller for logout the logined user
const logOutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined,
            },
        },
        {
            new: true,
        }
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});


// ADMIN LOGIN   Controller

const adminLogin = asyncHandler(async(req,res)=>{
    const {secret} = req.body;

    if(!secret){
        throw new ApiError(404, "Can not access the seceret")
    }

    if(secret === process.env.ADMIN_SECRET){
        const token = jwt.sign(
        {
            isAdmin : true
        },
        process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:"30d"
        }
    )

    return res
    .status(200)
    .json(
        new ApiResponse(200,
            {token},
            "Admin Login Successfully"
        )
    )

    }else{
        throw new ApiError(404, "Invalid Admin secret")
    }

    

})


//controller for refresh the access token for continue the session without login several times
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incommingRefreshToken =
        req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) {
        throw new ApiError(401, "Unauthorised request");
    }
    try {
        const decodedToken = jwt.verify(
            incommingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );
        const user = User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        if (incommingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }

        const options = {
            httpOnly: true,
            secure: true,
        };

        const { accessToken, newRefreshToken } =
            await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken)
            .cookie("refreshToken", newRefreshToken)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken: newRefreshToken },
                    "Access Token Refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});



export {
    registerUser,
    loginUser,
    logOutUser,
    adminLogin,
    refreshAccessToken,
  
};
