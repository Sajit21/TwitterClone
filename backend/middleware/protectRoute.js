

import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
export const protectRoute=async(req,res,next)=>{
    try {
     //access token
        const token=req.cookies.jwt;
        if(!token)
        {
            res.status(400).json({message: "token not found"})
        }

        //if token is there decode it 
        const decoded=jwt.verify(token,process.env.JWT_SECRET) 
        //toke lali access the get the env file of secret

        //if not decoded
        if(!decoded){
            return res.status(401).json({error: "Unathorized: invalid token"})
        }


         //selecting the decied user and we add select.("-password") so that it doesn't access the password

        const user=await User.findById(decoded.userId).select("-password"); //userId created in the generateToken function


        if(!user)
        {
            res.status(400).json({message: "user not found"})
        }

        //if the decodeduser is created the pass the user to the req.user:- that can be reuse
        req.user=user;

        next(); //if all the process is complete then we move to next part

        
    } 
    catch (error) {

        console.log("error in protectedRoute middleware",error.message)
        return res.status(500).json({error: "internal server error"})        
    }






}