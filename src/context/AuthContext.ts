import { createContext } from "react";


export const AuthContext = createContext<{
    loggedIn: boolean, 
    awaitAuth?: Promise<void>,
    resourceToken?: string, 
    updateAuth: (refreshToken: string, resourceToken: string)=>void
}>({loggedIn: false, updateAuth: ()=>{console.error("Auth context is not ready yet!")}});