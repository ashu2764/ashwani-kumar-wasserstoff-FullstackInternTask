import { asyncHandler } from "../utils/asyncHandler.js";
import { Auction } from "../models/auction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


//Create a new Auction

const createAuction = asyncHandler(async (req, res) => {
    const { itemName, startTime, endTime, startPrice } = req.body; // Extract required thing from request body

    //Validate we get all required things from body 
    if (
        [itemName, startTime, endTime, startPrice].some(
            (field) => field?.trim() === ""
        )
    ) {
        throw new ApiError(400, "All fields are required");
    }

    // if every thing is ok then create the auction
    const auction = await Auction.create({
        itemName,
        startTime,
        endTime,
        startPrice,

    })

    //validate for auction is created or not
    if (!auction) {
        throw new ApiError(500, "Error while creating the auction")
    }


    //If successfuly created user then return response
    return res
        .status(200)
        .json(
            new ApiResponse(200,
                auction,
                "Auction is created successfully"
            )
        )

})

//get all ongoing auctions

const getOnGoingAuctions = asyncHandler(async (req, res) => {
    const auctions = await Auction.find();

    if (!auctions || auctions.length === 0) {
        throw new ApiError(400, "No ongoing auctions found");
    }

    const currentTime = new Date();
    const ongoingAuctions = auctions.filter(auction => {
        const endTime = new Date(auction.endTime);
        return auction.status !== 'completed' && currentTime < endTime;
    });

    if (ongoingAuctions.length === 0) {
        throw new ApiError(400, "No ongoing auctions found");
    }

    return res.status(200).json(
        new ApiResponse(200, ongoingAuctions, "Ongoing auctions fetched successfully")
    );
});

//get auction by ID

const getAuctionById = asyncHandler(async (req, res) => {
    const auctionId = req.params.id;
    console.log(auctionId)

    if (!auctionId) {
        throw new ApiError(404, "Please provide a valid auctionId")
    }

    const auction = await Auction.findById(auctionId);

    if (!auction) {
        throw new ApiError(404, "Auction not Found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                auction,
                "Auction fetched by ID Successfully"
            )
        )
})


//Admin View All Auctions

const getAllAuctions = asyncHandler(async (req, res) => {
    const auction = await Auction.find();

    if (!auction) {
        throw new ApiError(501, "Unable to get all auctions")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(
                201,
                auction,
                "All Auction fetched Successfully"
            )
        )
})

//Updeate an Auction(Admin only)

const updateAuction = asyncHandler(async (req, res) => {

    const auctionId = req.params.id;

    if (!auctionId) {
        throw new ApiError(404, "Please provide a valid auctionId")
    }

    const { itemName, startTime, endTime, startPrice } = req.body

    const auction = await Auction.findById(auctionId);

    if (!auction) {
        throw new ApiError(501, "Can Not Find Auction")
    }

    auction.itemName = itemName;
    auction.startTime = startTime;
    auction.startPrice = startPrice;
    auction.endTime = endTime;

    const updatedAuction = await auction.save()

    if (!updatedAuction) {
        throw new ApiError(501, "Error while updating the Auction")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(201,
                updatedAuction,
                "Auction is updated successfully"
            )
        )


})


//Delete an Auction (Admin Only)

const deleteAuction = asyncHandler(async (req, res) => {

    const auctionId = req.params.id; // Extract auction id  from the request Params

    //check to validate auctiion id 
    if (!auctionId) {
        throw new ApiError(404, "Please provide a valid auctionId")
    }

    //delete the auction by auctionId
    const deletedAuction = await Auction.findByIdAndDelete(auctionId);

    //validate auction is deleted or not
    if (!deletedAuction) {
        throw new ApiError(404, "Can not find Auction to delete")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(201,
                "Auction deleted successfully"
            )
        )

})

// Place bid on a acution (user)

const placeBid = asyncHandler(async (req, res) => {
    const { bidAmount } = req.body;  // Extract bid amount from the request body
    const auctionId = req.params.id;  // Extract auction ID from the request parameters
    // const user = req.user._id;  // Get the current user's ID from the request 


    // Validate the bid amount
    if (!bidAmount) {
        throw new ApiError(404, "Bid amount is required to place a bid");
    }

    // Find the auction by ID
    const auction = await Auction.findById(auctionId);

    // Check if the auction exists
    if (!auction) {
        throw new ApiError(404, "No Auction Found");
    }

    const currentTime = new Date();
    // Check if the auction is completed or if the current time has passed the auction end time
    if (auction.status === 'completed' || currentTime > auction.endTime) {
        throw new ApiError(400, "Auction is completed");
    }

    // Set the highest bid with the current user and bid amount
    auction.highestBid = {
        amount: bidAmount,
        user: req.user._id,  // Store the current user who placed the bid
    };

    // Save the auction with the new bid
    await auction.save();

    // Populate the 'highestBid.user' field to include the user's details in the response
    await auction.populate('highestBid.user')

    // Return the updated auction with the user's bid information
    return res.status(200).json(
        new ApiResponse(200, auction, "Bid placed successfully")
    );
});


//completed auction

const completedAuction = asyncHandler(async (req, res) => {

    const auctionId = req.params.id; //Extract auctionId from req.params

    //Find Auction By AuctionID
    const auction = await Auction.findById(auctionId);

    //Validate auction is found or not 
    if (!auction) {
        throw new ApiError(404, "Auction not found")
    }

    //if everythin is ok the call completeAuction function
    auction.completeAuction()




    return res.status(200).json(
        new ApiResponse(200,
            auction,
            "auction is completed"
        )
    )


})










export {
    createAuction,
    getOnGoingAuctions,
    getAuctionById,
    getAllAuctions,
    updateAuction,
    deleteAuction,
    placeBid,
    completedAuction
}