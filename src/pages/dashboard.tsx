import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";


export default function Dashboard() {

    var authContext = useContext(AuthContext);
    const router = useRouter();

    const [data, setData] = useState<any>();

    useEffect(()=>{
        if (!authContext.awaitAuth && !authContext.loggedIn) router.push('/login');
    }, [authContext]);

    useEffect(()=>{
        if (authContext.awaitAuth || !authContext.loggedIn || data) return;

        axios.get('/api/hello', {headers: {Authorization: authContext.resourceToken}}).then(res=>{
            setData(res.data);
        })
    }, [authContext, data])

    if (data) return (
        <>
            TODO - Login protected page with data: {JSON.stringify(data)}
        </>
    );
    return (
        <>
            TODO - Skeleton Loader
        </>
    )
}

export function getStaticProps() {
    return {props: {title: "Dashboard"}}
  }