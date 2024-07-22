import "server-only";
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Session from "@/db/models/sessionModel";
import User from "@/db/models/userModel";
import {SessionPayload} from "@/definitions";

const skey = process.env.JWT_SECRET!;
const key = Buffer.from(skey, 'base64');

export async function encrypt(payload: SessionPayload) {

    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(key);
}

export async function decrypt(session: string| undefined = '') {
    try {
        const { payload } = await jwtVerify(session, key, {
            algorithms: ['HS256'],
        });
        return payload;
    } catch (error) {
        console.log('Failed to verify session');
        return null;
    }
}

export async function createSession(userId: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
       const session = new Session({
           userId,
           expiresAt,
       });
       const savedSession = await session.save();
       const payload = {
              sessionId: savedSession._id,
              userId: savedSession.userId,
              expiresAt
       }
       const encryptedSession = await encrypt(payload);

       cookies().set('session', encryptedSession, {
           httpOnly: process.env.NODE_ENV === 'production',
           secure: true,
           expires: expiresAt,
           sameSite: 'lax',
           path: '/',
       });
    return redirect('/dashboard');
}

export async function verifySession(session: string) {

    const payload = await decrypt(session);
    if (!payload) {
        return redirect('/login');
    }
    if (!payload?.userId){
        return redirect('/login');
    }
    const sessionData = await Session.findById(payload.sessionId);
    if (!sessionData) {
        return redirect('/login');
    }
    if (sessionData.expiresAt < new Date()) {
        await deleteSession(session);
        return redirect('/login');
    }
    const user = await User.findById(sessionData.userId);
    return {isLoggedIn: true, userId: user._id, sessionId: sessionData._id};
}

export async function updateSession() {
    const session = cookies().get('session')?.value;
    if (!session) {
        return redirect('/login');
    }
    const verifiedSession = await verifySession(session);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const dbSession = await Session.findById({ _id: verifiedSession.sessionId });
    if(!dbSession){
        return redirect('/login');
    }
    dbSession.expiresAt = expiresAt;
    await dbSession.save();
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteSession(sessionId: string) {
    await Session.findByIdAndDelete(sessionId);
    cookies().delete('session');
    return redirect('/login');
}