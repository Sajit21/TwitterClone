import User from "../model/user.model.js";
import bcrypt from "bcryptjs"


export const signUp=async(req, res) => {
   try {

    const {fullname,username,password,email} =req.body;
    const emailregex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!(emailregex).test(email))
    {
        res.status(400).json({Message: "incorrect format of the email"})
    }

    //if tyo username pailai exit cha bhani give error 
    const existingUser= await User.findOne({username})
    if(existingUser)
    {
        res.status(400).json({message:"username is already created or exist "})
    }

    const existingEmail=await User.findOne({email})
        if(existingEmail)
    {
        res.status(400).json({message:"Email is already created or exist "})

    }
    if(password.lenght<6){
        res.status(400).json({
            message: "password shouldnot be less than 6"
        })
    }

    //bycrypt the password in signup
    const salt=await bcrypt.genSalt(10)

    const hashpassword= await bcrypt.hash(password,salt)

    //after the conent the user is created// define all the content
    const newUser = new User({
        fullname,
        username,
        password:hashpassword,
        email
    })


    //after the create of user . cookie and token is gernerated 
    if(newUser){
        generateTokenAndSetCookie(newUser._id,res)
       await newUser.save(); // saving the content of the newUser acc to their id 
    }



   } catch (error) {
    
   }
res.status(200).json({message: "sigup is connected"})

}
// export const login=async(req, res) => {
//     try {
//      const {}
//     } catch (error) {
     
//     }
 
//  }
//  export const logout=async(req, res) => {
//     try {
//      const {}
//     } catch (error) {
     
//     }
 


// }