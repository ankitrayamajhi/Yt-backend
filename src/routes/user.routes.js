import {Router} from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken } from "../controllers/user.controller.js";
//To upload file like avtar ,cover image
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

//when control come from  app.js = /users
router.route("/register").post(
    upload.fields([
        {
           name:"avatar",
           maxCount:1 
        },
        {
            name:"coverImage",
            maxCount:1
        }

    ]),
    registerUser
    )
//router.route("/login").post(loginUser)
//then registerUser method is called which is located on controller
/*
http://localhost:8000/api/v1/users/register
http://localhost:8000/api/v1/users/login
*/


router.route("/login").post(loginUser)
//secured routes
router.route("/logout").post(verifyJWT, logoutUser)//not needed here = verifyJWT
router.route("/refresh-token").post(refreshAccessToken)

export default router