import {Router} from "express";
import { registerUser } from "../controllers/user.controller.js";
//To upload file like avtar ,cover image
import { upload } from "../middleewares/multer.middleware.js";
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
export default router