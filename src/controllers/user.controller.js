/*
For controller we need a helper file = asyncHandler.js

*/
import { asyncHandler } from "../utils/asyncHandler";

const registerUser = asyncHandler(async(req,res) => {
    return res.status(200).json({
        message:"Ok"
    })



})

export {registerUser}