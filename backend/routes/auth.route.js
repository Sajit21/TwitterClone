import express from "express"
import { signUp,login, logout,getMe } from "../controller/auth.controller.js";
import { protecteRoute } from "../middleware/protectRoute.js";
const router=express.Router();

router.post("/signup",signUp)
router.post("/login",login)
router.get("/me",protecteRoute,getMe)
router.get("/logout",logout)



export default router;