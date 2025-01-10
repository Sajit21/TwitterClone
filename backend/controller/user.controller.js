
import User from "../model/user.model.js";
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from "cloudinary";
// import { protectRoute } from "../middleware/protectRoute.js";
export const GetUserProfile=async(req,res)=>{
try {

    const {username}=req.params;
    const user=await User.findOne({username}).select("-password")
    if(!user)
    {
        res.status(400).json({message:"user not found"})
    }

    res.status(200).json(user)
    
} catch (error) {
    console.log("error in getuserprofile",error.message)
    res.status(500).json({error: error.message})


}
}

export const followUnfollowUser = async (req, res) => {
	try {
		const { id } = req.params;
		const userToModify = await User.findById(id);
		const currentUser = await User.findById(req.user._id);

		if (id === req.user._id.toString())
            //id (which is typically an ObjectId in MongoDB) into a string for comparison purposes 
        {
			return res.status(400).json({ error: "You can't follow/unfollow yourself" });
		}

		if (!userToModify || !currentUser) return res.status(400).json({ error: "User not found" });
    
        //check if currentuser is already following the another user  
		const isFollowing = currentUser.following.includes(id);

		if (isFollowing) { //if following then
			// Unfollow the user
            //$pull is a MongoDB operator used to remove an item from an array.
			await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

            //Removes the logged-in user's ID (req.user._id) from the followers array of the target user (id).
            //This means the target user will no longer be "followed" by the current user.



			await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            //Removes the target user's ID (id) from the following array of the logged-in user (req.user._id).
// This means the logged-in user is no longer "following" the target user.
			res.status(200).json({ message: "User unfollowed successfully" });
		} 
        else {
			// Follow the user
			await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });
			await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });
			
            
            // // Send notification to the user
			// const newNotification = new Notification({
			// 	type: "follow",
			// 	from: req.user._id,
			// 	to: userToModify._id,
			// });

			// await newNotification.save();

			res.status(200).json({ message: "User followed successfully" });
		}
	} catch (error) {
		console.log("Error in followUnfollowUser: ", error.message);
		res.status(500).json({ error: error.message });
	}
};

export const getSuggestedUsers=async(req,res)=>{
	try {


		const userId= req.user._id; //accessing the users id from the mongoose database
		const usersFollowedByMe= await User.findById(userId).select("following")
           //Tells Mongoose to only return the following field from the document ie from the logged in user

		
		//exclude the logged in user and select the random users from the database

		const users = await User.aggregate([
			{
				$match:{
					_id:{$ne:userId} //exclude the logged in user 
				}
			},
			{$sample:{size:10}} //random userid are selected from the database
		])
		const filteredUsers= users.filter(user=>!usersFollowedByMe.following.includes(user._id))

		const suggestedUsers= filteredUsers.slice(0,4)

		suggestedUsers.forEach(user=>user.password=null)
          res.status(200).json(suggestedUsers)


	} catch (error) {
		console.log("error in getSuggestedUsers: ", error.message)
		res.status(500).json({error:error.message})
		}
}

export const GetUpdateProfile=async(req,res)=>{
     const {username,email,fullname,currentPassword,newPassword,bio,link}=req.body;
	 let {profileImg,coverImg}=req.body;
	 const userId=req.user._id;


	 try {
		let user=await User.findById(userId); //since it has to be update 
		if(!user){
			res.status(400).json({message:"user not found"})
		}
		if((!currentPassword && newPassword) || (!newPassword && currentPassword))
        {
			res.status(400).json({error:"provide both  current password  and new password"})
		}
		if(currentPassword && newPassword)
		{
			const isMatch=await bcrypt.compare(currentPassword,user.password)
			if(!isMatch){
				 return res.status(400).json("current password doesn't match")
			}
			if(newPassword.length < 6)
			{
				return res.status(400).json({error: "password must be at least 6 character"})
			}

			const salt= await bcrypt.genSalt(10)
			user.password=await bcrypt.hash(newPassword,salt)

		}

		if(profileImg){
			if(user.profileImg){
				await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0])
			}
			const uploadedResponse = await cloudinary.uploader.upload(profileImg)
			profileImg = uploadedResponse.secure_url;
		}
		
		if(coverImg){
			if(user.coverImg){
				await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0])
			}
			const uploadedResponse = await cloudinary.uploader.upload(coverImg)
			coverImg = uploadedResponse.secure_url;
		}

		user.fullname= fullname ||user.fullname;
		user.email=email ||user.email;
		user.username=username || user.username;
		user.bio=bio || user.bio;
		user.link = link ||user.link;
		user.profileImg= profileImg ||user.profileImg;
		user.coverImg= coverImg || user.coverImg


		user= await user.save();
		user.password=null

		return res.status(200).json(user)

		
	 } catch (error) {
console.log("error in updateuser:", error.message)
res.status(500).json({error:error.message})		
	 }






}
