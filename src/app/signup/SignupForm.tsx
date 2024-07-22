"use client"
import { useFormState, useFormStatus } from 'react-dom';
import {signUp} from "@/actions/auth/auth";

import React from 'react';
import Link from "next/link";

const SignupForm = () => {
    const [state, action] = useFormState(signUp, undefined);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md px-8 py-6 mx-auto bg-white rounded-lg shadow-md">
                <form className="space-y-6 mb-6" action={action}>
                    <h2 className="text-3xl font-semibold text-center text-gray-900">Create an account</h2>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" name="name" id="name"
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                        {state?.errors?.name && <p className="text-sm text-red-500">{state.errors.name[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" id="email"
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                        {state?.errors?.email && <p className="text-sm text-red-500">{state.errors.email[0]}</p>}
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" name="password" id="password"
                               className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
                        {state?.errors?.password && (
                            <div className="text-sm text-red-500">
                                <p>Password must:</p>
                                <ul>
                                    {state.errors.password.map((error) => (
                                        <li key={error}>- {error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                    {state?.message && (
                        <p className="text-sm text-red-500">{state.message}</p>
                    )}
                    <div>
                        <SignUpButton/>
                    </div>
                </form>
                <Link className={"text-sm mt-5 flex justify-center items-center"} href={"/login"}>
                    {"Already have an account? "}
                    <span className={"font-bold text-gray-800 ml-1"}>
                         Login instead
                    </span>
                </Link>
            </div>
        </div>
    );
};

export function SignUpButton() {
    const {pending} = useFormStatus();
    return (
        <button aria-disabled={pending} type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {
                pending ? "Please Wait.." : "Create an Account"
            }
        </button>
    )
}

export default SignupForm;