import FormInput from "@/components/FormInput";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { FormEvent, useRef } from "react";

export default function SignUp() {

    const email = useRef<FormInput>(null);
    const user = useRef<FormInput>(null);
    const pass = useRef<FormInput>(null);
    const pass2 = useRef<FormInput>(null);

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email.current?.testInput() || !user.current?.testInput() || !pass.current?.testInput() || !pass2.current?.testInput()) return;
        if (pass.current.getValue() !== pass2.current.getValue()) return alert("Passwords must match");
        console.log("Submit",{email: email.current.getValue(), user: user.current.getValue(), pass: pass.current.getValue()})
    }
    
    return (
        <>
            <Navbar></Navbar>
            <div className="w-fill flex justify-center mt-8">
                <div className="rounded-lg shadow-lg px-6 sm:px-16 py-4 bg-slate-200 dark:bg-slate-800">
                    <h1 className="mb-4 text-2xl font-bold text-center">Sign Up</h1>
                    <form className="flex flex-col" onSubmit={onSubmit}>
                        <FormInput ref={email} id="email" label="Email" regex={
                            {"Invalid email address": /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                            "Email address must be less than 256 characters": /^.{0,256}$/}} 
                            attr={{autoComplete: "email", autoFocus: true}}>
                        </FormInput>

                        <FormInput ref={user} id="user" label="Username" regex={
                            {"Only letters, numbers, and underscores are allowed": /^[\w]*$/, 
                            "Must be between 3 and 24 characters": /^.{3,24}$/}} 
                            attr={{autoComplete: "off"}}>
                        </FormInput>
                        
                        <FormInput ref={pass} id="pass" label="Password" regex={
                            {"Only letters, numbers, and the following symbols are allowed: _-@$!%*#?&": /^[\w\-@$!%*#?&]*$/, 
                            "Must be between 8 and 32 characters": /^.{8,32}$/,
                            "Must contain at least 1 letter and 1 number": /^(?=.*[A-Za-z])(?=.*\d).*$/}} 
                            attr={{type: "password", autoComplete: "new-password"}}>
                        </FormInput>

                        <FormInput ref={pass2} id="pass2" label="Confirm Password" regex={
                            {"Only letters, numbers, and the following symbols are allowed: _-@$!%*#?&": /^[\w\-@$!%*#?&]*$/, 
                            "Must be between 8 and 32 characters": /^.{8,32}$/,
                            "Must contain at least 1 letter and 1 number": /^(?=.*[A-Za-z])(?=.*\d).*$/}} 
                            attr={{type: "password", autoComplete: "new-password"}}>
                        </FormInput>
                        
                        
                        <div className="text-center mt-4">
                            <input type="submit" value={"Continue"} className="w-min rounded-lg shadow font-semibold mx-1 px-4 py-[2px] cursor-pointer transition-all text-navy-50 bg-blue-500 dark:bg-blue-700 hover:shadow-lg hover:scale-105"></input>
                        </div>
                    </form>
                    <div className="text-center mt-4 font-semibold">Already have an account? <Link href="/login" className="text-blue-500">Log In!</Link></div>
                </div>
            </div>
        </>
    )
}