import mongoose from "mongoose";
import User from "@/db/models/userModel";

export interface ISession extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    expiresAt: Date;
}

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: User,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    }
});

const Session = mongoose.models.Session || mongoose.model<ISession>("Session", SessionSchema);
export default Session;