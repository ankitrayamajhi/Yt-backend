// import { Promise } from "mongoose"

const asyncHandler = (requestHandler) =>{
    return (req,res,next)=>{
        //Promise.resolve.catch
        Promise.resolve(requestHandler(req,res,next)).catch((err) => next(err))

    }


}

export {asyncHandler}
 

//asyncHandler is higher order function = it can accept function as parameter and return too
/*
const asyncHandler = ()=>{}
const asyncHandler = (function) => () =>{}
const asyncHandler = (function) => async() =>{}

*/

/*
const asyncHandler = (fn) => async(req,res,next) =>{//() => other function handler
    try {
        await fn(req,res,next)
        
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }

} 
*/
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

