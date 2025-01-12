import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { getUserProfile, followUnfollowUser, getSuggestedUsers,getUpdateProfile} from "../controller/user.controller.js";

const router=express.Router();


router.get("/profile/:username",protectRoute,getUserProfile)
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/update",protectRoute,getUpdateProfile)

export default router;