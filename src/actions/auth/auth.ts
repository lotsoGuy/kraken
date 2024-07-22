"use server"
import User, {IUser} from "@/db/models/userModel";
import connectMongo from "@/db/connection";
import {createSession, decrypt, deleteSession} from "@/actions/auth/sessions";
import {SignupFormSchema, LoginFormSchema, FormState, SessionPayload} from "@/definitions";
import bcrypt from "bcrypt";
import {cookies} from "next/headers";


export async function signUp(
         state: FormState,
         formData: FormData
    ):Promise<FormState>{

        const verifiedFields = SignupFormSchema.safeParse({
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
        });
        if(!verifiedFields.success){
            return {
                errors: verifiedFields.error.flatten().fieldErrors,
            };
        }

        const {name, email, password} = verifiedFields.data;

        await connectMongo();
        const existingUser = await User.findOne({email});
        if(existingUser){
            return {
                errors: {
                    email: ['Email already exists.'],
                },
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            name: name,
            email,
            password: hashedPassword,
        })
        await user.save();
    if (!user) {
        return {
            message: 'An error occurred while creating your account.',
        };
    }
    await createSession(user._id);

}

export async function logIn(
    state: FormState,
    formData: FormData
): Promise<FormState> {
    const verifiedFields = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });
    if (!verifiedFields.success) {
        return {
            errors: verifiedFields.error.flatten().fieldErrors,
        };
    }

    const { email, password } = verifiedFields.data;

    await connectMongo();
    const user = await User.findOne({ email });
    if (!user) {
        return {
            message: "Invalid credentials",
        };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return {
            message: "Invalid credentials",
        };
    }

    await createSession(user._id);
}

export async function logout() {
    const cookie = cookies().get('session')?.value;
    if (!cookie) {
        return;
    }
    const session = await decrypt(cookie) as SessionPayload;
    return await deleteSession(session.sessionId);
}