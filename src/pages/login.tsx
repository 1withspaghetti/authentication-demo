import FormInput from "@/components/FormInput";
import Navbar from "@/components/Navbar";
import { LoginValidator } from "@/types/AuthTypes";
import Link from "next/link";
import { FormEvent, useRef } from "react";

export default function Login() {

    const user = useRef<FormInput>(null);
    const pass = useRef<FormInput>(null);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!user.current?.testInput() || !pass.current?.testInput()) return;
        console.log("Submit",{user: user.current.getValue(), pass: pass.current.getValue()})
    }
    
    return (
        <>
            <Navbar></Navbar>
            <div className="w-fill flex justify-center mt-8">
                <div className="rounded-lg shadow-lg px-6 sm:px-16 py-4 bg-slate-200 dark:bg-slate-800">
                    <h1 className="mb-4 text-2xl font-bold text-center">Login</h1>
                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <FormInput ref={user} id="user" label="Username or Email" validator={LoginValidator.user} 
                            attr={{autoComplete: "username", autoFocus: true}}></FormInput>

                        <FormInput ref={pass} id="pass" label="Password" validator={LoginValidator.pass} 
                            attr={{type: "password", autoComplete: "current-password"}}>
                                <Link href="/password-recovery" className="text-sm text-blue-500" style={{lineHeight: "24px"}}>Forgot Password</Link>
                        </FormInput>
                        <div className="text-center mt-4">
                            <input type="submit" value={"Continue"} className="w-min rounded-lg shadow font-semibold mx-1 px-4 py-[2px] cursor-pointer transition-all text-navy-50 bg-blue-500 dark:bg-blue-700 hover:shadow-lg hover:scale-105"></input>
                        </div>
                    </form>
                    <div className="text-center mt-4 font-semibold">Don&apos;t have an account? <Link href="/sign-up" className="text-blue-500">Sign Up!</Link></div>
                </div>
            </div>
        </>
    )
}