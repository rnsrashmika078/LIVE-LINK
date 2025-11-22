import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    dp: {
        type: String,
        required: false,
    },
    // online: {
    //     type: String,
    //     required: true,
    // },
    // lastSeen: {
    //     type: String,
    //     required: true,
    // },
});
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
