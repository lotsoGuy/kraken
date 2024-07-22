"use server";

import User, {IUser} from "@/db/models/userModel";
import connectMongo from "@/db/connection";
import {verifySession} from "@/actions/auth/sessions";
import {cookies} from "next/headers";

export async function getUser(){
    await connectMongo();
    const session = cookies().get('session')?.value;
    const sessionData = await verifySession(session!);
    const user: IUser[] = await User.find();
    return user;
}