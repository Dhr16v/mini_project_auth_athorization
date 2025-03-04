const mongoose=require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const userSchema=mongoose.Schema(
    {
       name:String,
       username:String,
       age:Number,
       email:String,
       password:String,
       posts:[
        {
            type:mongoose.Types.ObjectId, ref:"post"
        }
       ]
    }
)

let userModel=mongoose.model('User',userSchema);

module.exports=userModel