import mongoose, {Schema} from "mongoose"


import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema(
    {
        username:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
            index:true//searching fast
        },
        email:{
            type: String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true,
        },
        fullName:{
            type: String,
            required:true,
            trim:true,
            index:true//searching fast
        },
        avatar:{
            type:String,//cloudinary url
            required:true,
        },
        coverImage:{
            type:String,//cloudinary url
            // required:true,
        },
        watchHistory:[
            {
                type:Schema.Types.ObjectId,
                ref:"Video"
            }//Array of watchHistory

        ],
        password:{
            type:String,
            required:[true,'Password is required !']
            
        },
        refreshToken:{
            type:String,
        }

    },
    {
        timestamps:true
    }
)

// userSchema.pre("save") //before save
// userSchema.pre("save", ()=> {

// }) //not

userSchema.pre("save", async function (next) 

    //midddleware flag = next
    //function() = to manupulate userSchema data

    {
        // if (this.isModified("password")) {
        //     this.password = bcrypt.hash(this.password,8)//8 = hash round 
        //      next()
        // }
        if (!this.isModified("password")) return next();//negetive check
            
        this.password = await bcrypt.hash(this.password,10)
        next()
    
    } 
) 
//custom method
//userSchema
//object = method
//property = isPasswordCorrect

userSchema.methods.isPasswordCorrect = async function 
(password) {
    //bcrypt.compare(password,this.password)
    // await bcrypt.compare(password,this.password)
    return await bcrypt.compare(password,this.password)
}



userSchema.methods.generateAccessToken = function()
{
    return jwt.sign(//sign used to generate token
        {//payload = table name
            _id : this.id,
            email : this.email,
            username : this.username,
            fullName : this.fullName

        },
            process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
   
   
    )
     
}
userSchema.methods.generateRefreshToken = function()
{
    return jwt.sign(//sign used to generate token
        {//payload = table name
            _id : this.id,

        },
            process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
   
   
    )
}

export const User = mongoose.model("User",userSchema)

/*
 npm i bcrypt = A library to help you hash password
 npm i jsonwebtoken=  to securely transfer information over the web(between two parties   


 midddlewares/pre hook is used for this purpose
 pre hook run before data save
 or it encrypt password before save

*/