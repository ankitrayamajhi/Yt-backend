import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
const app = express();

// use is used for middleewares and configuration purpose

//configuration of cors
// app.use(cors()) = it is for normal
//But in production level
app.use(cors({
    origin:process.env.CORS_ORIGIN, //option
    credentials:true
}))


app.use(express.json({limit:"16kb"}))//json data accept
app.use(express.urlencoded({extended:true, limit:"16kb"}))//url data accept
//url encoder is used to convert space to  %20  
app.use(express.static("public")) //to store image,file ,favicon ,it is a folder


/*
Cookie -parser
secure cookie stored on users browser
secure cookie only server can read and remove
*/
app.use(cookieParser())
/*
Middlewares
client hit url like /instagram
err,req,res,next
req is used to handle and res used to send
res.send(), res.json() is used to send response

middleewares is used to check credentials
like check if user i logged in and check if user is admin
next is flag which is passed after operation is sucessfully run (one middleeware to other)
After all middleewares it is discarded
*/



export { app }