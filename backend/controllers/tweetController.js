import axios from 'axios';
import { Tweet } from "../models/tweetSchema.js";
import { User } from "../models/userSchema.js";


export const createTweet = async (req, res) => {
    try {
        const { description, id } = req.body;

        // Check if required fields are present
        if (!description || !id) {
            return res.status(400).json({
                message: "Fields are required.",
                success: false,
            });
        }

        // Fetch user details (excluding password)
        const user = await User.findById(id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false,
            });
        }
        console.log("before 5000");

        // Call the Flask API for sentiment analysis
        const sentimentResponse = await axios.post('http://localhost:5000/analyze-sentiment', {
            text: description,
        });

        const sentiment = sentimentResponse.data.sentiment;
console.log("after 5000");
        // Create a new tweet with sentiment
        await Tweet.create({
            description,
            userId: id,
            userDetails: user,
            sentiment, // Add sentiment to the tweet object
        });

        return res.status(201).json({
            message: "Tweet created successfully.",
            success: true,
        });
    } catch (error) {
        console.error(error);

        // Handle Flask API errors or any other issue
        if (error.response && error.response.data) {
            return res.status(500).json({
                message: `Error: ${error.response.data.error}`,
                success: false,
            });
        }

        return res.status(500).json({
            message: "An error occurred while creating the tweet.",
            success: false,
        });
    }
};
export const deleteTweet = async (req,res) => {
    try {
        const {id}  = req.params;
        await Tweet.findByIdAndDelete(id);
        return res.status(200).json({
            message:"Tweet deleted successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}

export const likeOrDislike = async (req,res) => {
    try {
        const loggedInUserId = req.body.id;
        const tweetId = req.params.id;
        const tweet = await Tweet.findById(tweetId);
        if(tweet.like.includes(loggedInUserId)){
            // dislike
            await Tweet.findByIdAndUpdate(tweetId,{$pull:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User disliked your tweet."
            })
        }else{
            // like
            await Tweet.findByIdAndUpdate(tweetId, {$push:{like:loggedInUserId}});
            return res.status(200).json({
                message:"User liked your tweet."
            })
        }
    } catch (error) {
        console.log(error);
    }
};
export const getAllTweets = async (req,res) => {
    // loggedInUser ka tweet + following user tweet
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id);
        const loggedInUserTweets = await Tweet.find({userId:id});
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:loggedInUserTweets.concat(...followingUserTweet),
        })
    } catch (error) {
        console.log(error);
    }
}
export const getFollowingTweets = async (req,res) =>{
    try {
        const id = req.params.id;
        const loggedInUser = await User.findById(id); 
        const followingUserTweet = await Promise.all(loggedInUser.following.map((otherUsersId)=>{
            return Tweet.find({userId:otherUsersId});
        }));
        return res.status(200).json({
            tweets:[].concat(...followingUserTweet)
        });
    } catch (error) {
        console.log(error);
    }
}
 