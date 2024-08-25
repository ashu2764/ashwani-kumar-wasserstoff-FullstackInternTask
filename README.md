## Microsercvice for User Management and Auction Management

## User Management API
This API is part of a microservices architecture that handles user management and authentication for a larger auction bidding system. The following endpoints allow for user registration, login, logout, token refresh, and admin authentication.

# Features
User Registration: Allows new users to register with their email, username, and password.
User Login: Authenticates users using their email/username and password, and provides access and refresh tokens.
User Logout: Logs out the user by clearing their refresh token.
Admin Login: Authenticates an admin user using a secret key and provides an access token.
Token Refresh: Refreshes the access token using a valid refresh token.

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

Clone the repository

git clone https://github.com/ashu2764/ashwani-kumar-wasserstoff-FullstackInternTask 

cd auction-management/
cd user-management/
