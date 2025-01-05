import express from "express"
import { signUp } from "../controller/auth.controller.js";

const router=express.Router();

router.post("/signup",signUp)
// router.post("/login",login)

// router.get("/logout",logout)





export default router;