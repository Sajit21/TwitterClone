import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import createRoute from "../controller/post.controller.js"
const router=express.Router();

router.post("/create",protectRoute,createRoute)
// router.post("/like/:id",protectRoute,likeUnlikePost)
// router.post("/comment/:id",protectRoute,commentOnPost)
// router.delete("/",protectRoute,deletePost)




export default router;