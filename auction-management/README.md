## Auction Management API
This API is part of a microservices architecture designed for managing auctions within an auction system. It provides endpoints for creating, updating, deleting auctions, fetching ongoing auctions, and placing bids.

# Features
Create Auction: Allows admins to create new auctions.
Get Ongoing Auctions: Fetches all auctions that are currently active.
Get Auction by ID: Retrieves a specific auction by its ID.
Get All Auctions: Admin view to fetch all auctions.
Update Auction: Allows admins to update details of an existing auction.
Delete Auction: Allows admins to delete an auction.
Place Bid: Allows users to place bids on active auctions.
Complete Auction: Marks an auction as completed.


# Prerequisites
Before running the API, ensure you have the following installed:

Node.js
MongoDB


# Installation

cd auction-management

# Install dependencies:
npm install


# Create a .env file in the root directory with the following variables:

USER_MANAGEMENT_URL= http://localhost:8000/api/v1/user/getCurrentUser
PORT= <your_port>
MONGO_URI=<your-mongodb-uri>
ACCESS_TOKEN_SECRET=<your-access-token-secret>
REFRESH_TOKEN_SECRET=<your-refresh-token-secret>


# Start the server:
npm run dev

# API Endpoints

# Create Auction
URL: /api/v1/auction/
Method: POST
Description: Creates a new auction.
Authorization: Admin
Request Body:
json

{
    "itemName": "Antique Vase",
    "startTime": "2024-08-22T10:00:00Z",
    "endTime": "2024-08-29T10:00:00Z",
    "startPrice": 1000
}


Response:
json

{
    "statusCode": 200,
    "data": {
        "_id": "auction-id",
        "itemName": "Antique Vase",
        "startTime": "2024-08-22T10:00:00Z",
        "endTime": "2024-08-29T10:00:00Z",
        "startPrice": 1000
    },
    "message": "Auction is created successfully",
    "success": true
}


# Get Ongoing Auctions
URL: /api/v1/auction/
Method: GET
Description: Fetches all ongoing auctions.
Authorization: Logged-in user 
Response:
json

{
    "statusCode": 200,
    "data": [
        {
            "_id": "auction-id",
            "itemName": "Antique Vase",
            "startTime": "2024-08-22T10:00:00Z",
            "endTime": "2024-08-29T10:00:00Z",
            "startPrice": 1000
        }
    ],
    "message": "Ongoing auctions fetched successfully",
    "success": true
}


# Get Auction by ID
URL: /api/v1/auction/:id
Method: GET
Description: Fetches details of a specific auction by its ID.
Authorization: Logged-in user
Response:
json

{
    "statusCode": 200,
    "data": {
        "_id": "auction-id",
        "itemName": "Antique Vase",
        "startTime": "2024-08-22T10:00:00Z",
        "endTime": "2024-08-29T10:00:00Z",
        "startPrice": 1000
    },
    "message": "Auction fetched by ID Successfully",
    "success": true
}


# Get All Auctions (Admin Only)
URL: /api/v1/auction/admin/all
Method: GET
Description: Admin view to fetch all auctions.
Authorization: Admin
Response:
json

{
    "statusCode": 200,
    "data": [
        {
            "_id": "auction-id",
            "itemName": "Antique Vase",
            "startTime": "2024-08-22T10:00:00Z",
            "endTime": "2024-08-29T10:00:00Z",
            "startPrice": 1000
        }
    ],
    "message": "All Auction fetched Successfully",
    "success": true
}
# Update Auction (Admin Only)
URL: /api/v1/auction/:id
Method: PUT
Description: Updates an auction's details.
Authorization: Admin
Request Body:
json

{
    "itemName": "Updated Antique Vase",
    "startTime": "2024-08-22T10:00:00Z",
    "endTime": "2024-08-29T10:00:00Z",
    "startPrice": 1200
}
Response:
json

{
    "statusCode": 200,
    "data": {
        "_id": "auction-id",
        "itemName": "Updated Antique Vase",
        "startTime": "2024-08-22T10:00:00Z",
        "endTime": "2024-08-29T10:00:00Z",
        "startPrice": 1200
    },
    "message": "Auction is updated successfully",
    "success": true
}


# Delete Auction (Admin Only)
URL: /api/v1/auction/:id
Method: DELETE
Description: Deletes an auction.
Authorization: Admin
Response:
json

{
    "statusCode": 200,
    "data": {},
    "message": "Auction deleted successfully",
    "success": true
}


# Place Bid
URL: /api/v1/auction/:id/bid
Method: POST
Description: Places a bid on an ongoing auction.
Authorization: Logged-in user
Request Body:
json

{
    "bidAmount": 1500
}


Response:
json

{
    "statusCode": 200,
    "data": {
        "_id": "auction-id",
        "itemName": "Antique Vase",
        "startTime": "2024-08-22T10:00:00Z",
        "endTime": "2024-08-29T10:00:00Z",
        "startPrice": 1000,
        "highestBid": {
            "amount": 1500,
            "user": {
                "_id": "user-id",
                "username": "user123"
            }
        }
    },
    "message": "Bid placed successfully",
    "success": true
}

# Complete Auction (Admin Only)
URL: /api/v1/auction/:id/complete
Method: PUT
Description: Marks an auction as completed.
Authorization: Admin
Response:
json

{
    "statusCode": 200,
    "data": {
        "_id": "auction-id",
        "itemName": "Antique Vase",
        "status": "completed",
        "highestBid": {
            "amount": 1500,
            "user": {
                "_id": "user-id",
                "username": "user123"
            }
        }
    },
    "message": "Auction is completed",
    "success": true
}