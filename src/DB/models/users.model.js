import mongoose, { Types } from "mongoose";

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password:{
        type:String,
        required: true,
    },
    phone:{
        type:String,
        required: true,
    },
    age:{
        type:Number,
        min:18,
        max:60
    },
});

const usersModel =mongoose.model.Users || mongoose.model("Users", usersSchema);
export default usersModel;