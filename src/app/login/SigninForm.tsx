"use client"
import { useFormState, useFormStatus } from 'react-dom';
import {logIn} from "@/actions/auth/auth";

import React, { useState } from 'react';
import Link from "next/link";

const SignInForm = () => {
const [state, action] = useFormState(logIn, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md px-8 py-6 mx-auto bg-white rounded-lg shadow-md">
                <form className="space-y-6 mb-6" action={action} >
                    <h2 className="text-3xl font-semibold text-center text-gray-900">Sign In</h2>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"  />
                        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password" required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"  />
                        {state?.errors?.password && <p className="text-sm text-red-500">{state.errors.password[0]}</p>}
                    </div>
                    {state?.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                    <div>
                       <LoginButton/>
                    </div>
                </form>
                <Link className={"text-sm mt-5 flex justify-center items-center"} href={"/signup"}>
                    {"No Account? "}
                    <span className={"font-bold text-gray-800 ml-1"}>
                         Create one
                    </span>
                </Link>
            </div>
        </div>
    );
};

export function LoginButton(){
    const {pending} = useFormStatus();
    return (
        <button type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {
                pending ? "Please Wait.." : "Sign In"
            }
        </button>
    )
}

export default SignInForm;