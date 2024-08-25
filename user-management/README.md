## User Management API
This API is part of a microservices architecture that handles user management and authentication for a larger auction bidding system. The following endpoints allow for user registration, login, logout, token refresh, and admin authentication.

# Features
User Registration: Allows new users to register with their email, username, and password.
User Login: Authenticates users using their email/username and password, and provides access and refresh tokens.
User Logout: Logs out the user by clearing their refresh token.
Admin Login: Authenticates an admin user using a secret key and provides an access token.
Token Refresh: Refreshes the access token using a valid refresh token.


# Prerequisites
Before running the API, ensure you have the following installed:

Node.js
MongoDB


# Installation

cd user-management/

# Install dependencies:
npm install


# Create a .env file in the root directory with the following variables:

PORT:<your-port>
MONGO_URI=<your-mongodb-uri>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
ADMIN_SECRET=<your-admin-secret>


# Start the server:
npm run dev



## API Endpoints for Auth Controller and Routes

# User Registration
URL: /api/v1/auth/register
Method: POST
Description: Registers a new user.
Request Body:
json

{
    "email": "user@example.com",
    "username": "user123",
    "password": "password123"
}


Response:
json

{
    "statusCode": 201,
    "data": {
        "email": "user@example.com",
        "username": "user123",
        "_id": "user-id"
    },
    "message": "User Registered Successfully",
    "success": true
}


# User Login

URL: /api/v1/auth/login
Method: POST
Description: Authenticates a user and provides access and refresh tokens.
Request Body:
json

{
    "username": "user123",
    "password": "password123"
}


Response:
json

{
    "statusCode": 200,
    "data": {
        "user": {
            "email": "user@example.com",
            "username": "user123",
            "_id": "user-id"
        },
        "accessToken": "access-token",
        "refreshToken": "refresh-token"
    },
    "message": "User Logged In Successfully",
    "success": true
}



# User Logout (verifyJWTUser)
URL: /api/v1/auth/logout
Method: POST
Description: Logs out the authenticated user.
Request Body: None
Response:
json

{
    "statusCode": 200,
    "data": {},
    "message": "User Logged Out Successfully",
    "success": true
}


# Admin Login
URL: /api/v1/auth/admin-login
Method: POST
Description: Authenticates an admin user using a secret key.
Request Body:


{
    "secret": "your-admin-secret"
}


Response:
json

{
    "statusCode": 200,
    "data": {
        "token": "admin-access-token"
    },
    "message": "Admin Login Successfully",
    "success": true
}


# Refresh Access Token (verifyJWTUser)
URL: /api/v1/auth/refresh-token
Method: POST
Description: Refreshes the access token using a valid refresh token.
Request Body:
json

{
    "refreshToken": "your-refresh-token"
}

Response:
json

{
    "statusCode": 200,
    "data": {
        "accessToken": "new-access-token",
        "refreshToken": "new-refresh-token"
    },
    "message": "Access Token Refreshed",
    "success": true
}




## API Endpoints for User Controller and Routes

# Get All Users (Admin Only)
URL: /api/v1/user/
Method: GET
Description: Fetches all users' information.
Authorization: Admin
Response:
json


{
    "statusCode": 200,
    "data": {
        "users": [
            {
                "_id": "user-id-1",
                "email": "user1@example.com",
                "username": "user1"
            },
            {
                "_id": "user-id-2",
                "email": "user2@example.com",
                "username": "user2"
            }
        ]
    },
    "message": "All users fetched successfully",
    "success": true
}


# Get User by ID
URL: /api/v1/user/:id
Method: GET
Description: Fetches a user's details by ID.
Authorization: Logged-in user
Response:
json


{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "user-id",
            "email": "user@example.com",
            "username": "user123"
        }
    },
    "message": "User fetched successfully",
    "success": true
}


# Change Current Password
URL: /api/v1/user/:id
Method: PUT
Description: Changes the current logged-in user's password.
Authorization: Logged-in user
Request Body:
json


{
    "oldPassword": "old-password",
    "newPassword": "new-password"
}

Response:
json

{
    "statusCode": 200,
    "data": {},
    "message": "Password changed successfully",
    "success": true
}


# Delete User
URL: /api/v1/user/:id
Method: DELETE
Description: Deletes a user by ID.
Authorization: Admin or user (self-deletion)
Response:
json

{
    "statusCode": 200,
    "data": {},
    "message": "User deleted successfully",
    "success": true
}


# Get Current User
URL: /api/v1/user/getCurrentUser
Method: GET
Description: Fetches the details of the currently logged-in user.
Authorization: Logged-in user
Response:
json

{
    "statusCode": 200,
    "data": {
        "user": {
            "_id": "current-user-id",
            "email": "current-user@example.com",
            "username": "currentuser"
        }
    },
    "message": "Current user fetched successfully",
    "success": true
}