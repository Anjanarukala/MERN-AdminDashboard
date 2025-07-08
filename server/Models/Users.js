const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    name:String,
    email:String,
    age:Number,
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'auth',
        required:true
    }
});

const UserModel= mongoose.model("users",UserSchema);
module.exports=UserModel;