import SignInForm from "@/app/login/SigninForm";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {verifySession} from "@/actions/auth/sessions";

export default async function LoginPage(){
    const cookie = cookies().get('session')?.value as string;
    if(cookie){
        const {isLoggedIn} = await verifySession(cookie);
        if(isLoggedIn){
          return redirect('/dashboard');
        }

    }
    return(
       <SignInForm/>
    )
}