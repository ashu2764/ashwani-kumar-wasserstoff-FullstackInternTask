import mongoose, { Schema } from "mongoose";

const auctionSchema = new Schema({
    itemName: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    startPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        default: 'ongoing',
    },
    highestBid: {
        amount: {
            type: Number,
            default: 0,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',  // Reference to the User model
            default: null,
        },
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
}, {
    timestamps: true,
});


//function for change the status of auction
auctionSchema.methods.completeAuction = function () {
    this.status = 'completed'
    this.winner = this.highestBid.user
    return this.save(); 
}


export const Auction = mongoose.model("Auction", auctionSchema)