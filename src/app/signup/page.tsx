import SignupForm from "@/app/signup/SignupForm";
import {cookies} from "next/headers";
import {verifySession} from "@/actions/auth/sessions";
import {redirect} from "next/navigation";

export default async function LoginPage(){
    const cookie = cookies().get('session')?.value as string;
     if(cookie) {
         const {isLoggedIn} = await verifySession(cookie);
         if (isLoggedIn) {
             return redirect('/dashboard');
         }
     }
        return(
        <SignupForm/>
    );
}