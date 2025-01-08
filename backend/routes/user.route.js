import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { GetUserProfile, followUnfollowUser, getSuggestedUsers,GetUpdateProfile} from "../controller/user.controller.js";

const router=express.Router();


router.get("/profile/:username",protectRoute,GetUserProfile)
router.post("/follow/:id", protectRoute, followUnfollowUser);
router.get("/suggested",protectRoute,getSuggestedUsers)
router.post("/update",protectRoute,GetUpdateProfile)

export default router;