import express from "express"
import { signUp,login, logout,getMe } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router=express.Router();

router.post("/signup",signUp)
router.post("/login",login)
router.get("/me",protectRoute,getMe)
router.get("/logout",logout)



export default router;