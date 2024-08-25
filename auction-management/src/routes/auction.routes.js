import { Router } from "express";
import { verifyJWTUser, verifyJWTAdmin } from "../middlewares/auth.middleware.js";
import {
    placeBid,
    createAuction,
    getOnGoingAuctions,
    getAuctionById,
    getAllAuctions,
    updateAuction,
    deleteAuction,
    completedAuction

} from "../controllers/auction.controller.js";


const router = Router();

router.route('/')
    .post(verifyJWTAdmin, createAuction)
    .get(verifyJWTUser, getOnGoingAuctions)

router.route('/:id')
    .get(verifyJWTUser, getAuctionById)
    .put(verifyJWTAdmin, updateAuction)
    .delete(verifyJWTAdmin, deleteAuction)

router.route('/:id/bid')
    .post(verifyJWTUser, placeBid)

router.route('/admin/all')
    .get(verifyJWTAdmin, getAllAuctions)


router.route('/:id/complete')
    .post(verifyJWTAdmin, completedAuction)

export default router;
