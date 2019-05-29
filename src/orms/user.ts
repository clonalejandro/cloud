/** IMPORTS **/

import mongoose from 'mongoose';


/** REST **/

export interface IUser extends mongoose.Document {
    email: string,
    username: string,
    password: string,
    rankId: number
}

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    rankId: {
        type: Number,
        required: true
    }
});

export default mongoose.model<IUser>("User", UserSchema)