import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { GetUserProfile, followUnfollowUser, getSuggestedUsers} from "../controller/user.controller.js";

const router=express.Router();


router.get("/profile/:username",protectRoute,GetUserProfile)
router.get("/follow/:id", protectRoute, followUnfollowUser);
router.post("/suggested",protectRoute,getSuggestedUsers)

export default router;