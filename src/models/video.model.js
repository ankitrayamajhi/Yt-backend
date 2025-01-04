import mongoose,{Schema} from "mongoose";

import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
const videoSchema = new Schema(
    {
        videoFile:{
            type:String,//cloudinary url
            required:true
        },
        thumbnail:{
            type:String,//cloudinary url
            required:true
        },
        title:{
            type:String,
            required:true,
        },
        description:{
            type:String,
            required:true
    
        },
        duration:{
            type:Number,//cloudinary url
            required:true
        },
        isPublished:{
            type:Boolean,
            default:true
        },
        views:{
            type:Number,
            default:0
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        },
    },
    {
        timeseries:true
    }
)
//mongooseAggregatePaginate used here
videoSchema.plugin(mongooseAggregatePaginate)

 //Now we are able to write aggregation quires


export const Video = mongoose.model("Video",videoSchema)


/*
mongoose-aggregate-paginate-v2
uesed to write aggrigation query
npm install mongoose-aggregate-paginate-v2
*/