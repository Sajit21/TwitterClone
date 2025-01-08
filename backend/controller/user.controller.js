
import User from "../model/user.model.js";
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

		
		//exclude the logged in user and select the random users from the database
		
		const users = await User.aggregate([
			{
				$match:{
					_id:{$ne:userId}
				}
			},
			{$sample:{size:10}}
		])
		const filteredUsers= users.filter(user=>!usersFollowedByMe.following.includes(user._id))

		const suggestedUsers= filteredUsers.slice(0,4)

		suggestedUsers.forEach(user=>user.password=null)
          res.status(200).forEach(user=>user.password=null)


	} catch (error) {
		console.log("error in getSuggestedUsers: ", error.message)
		res.status(500).json({error:error.message})
		}
}
