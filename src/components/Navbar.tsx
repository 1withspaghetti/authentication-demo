import { useEffect, useState } from "react"
import ThemeSwitch from "./ThemeSwitch";
import Link from "next/link";

export default function Navbar() {

    var [open, setOpen] = useState<boolean>(false);
    
    return (
        <div className='sticky top-0 left-0 right-0 bg-slate-200 dark:bg-slate-800 shadow-lg flex justify-between'>
            <div className={`flex flex-col sm:flex-row overflow-hidden transition-all ${open ? 'h-33'/* MUST BE 12 times the # of nav items*/ : 'h-11'} sm:h-11`}>
                <div className="flex">
                    <Link href="/" className="text-xl pr-2 sm:pr-5 font-bold px-5 pt-2 pb-1 cursor-pointer transition-[border-color] border-slate-200 dark:border-slate-800 border-b-4 bg-slate-200 hover:border-blue-500 dark:bg-slate-800 dark:hover:border-blue-700">Website Name</Link>
                    <div onClick={()=>{setOpen(!open)}} tabIndex={0} className="cursor-pointer sm:hidden">
                        <svg className={`transition-all ${open ? '-rotate-180' : ''}`} fill="currentColor" xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48"><path d="M480 711 240 471l43-43 197 198 197-197 43 43-240 239Z"/></svg>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row w-min">
                    <Link href="" className="text-lg font-semibold px-5 pt-2 pb-1 cursor-pointer transition-[border-color] border-slate-200 dark:border-slate-800 border-b-4 bg-slate-200 hover:border-blue-500 dark:bg-slate-800 dark:hover:border-blue-700">Example</Link>
                    <Link href="" className="text-lg font-semibold px-5 pt-2 pb-1 cursor-pointer transition-[border-color] border-slate-200 dark:border-slate-800 border-b-4 bg-slate-200 hover:border-blue-500 dark:bg-slate-800 dark:hover:border-blue-700">Example</Link>
                </div>
            </div>
            <div className="flex items-center h-11">
                <Link href="/login" className="h-min rounded-lg shadow text-lg font-semibold mx-1 px-4 py-[2px] cursor-pointer transition-all text-navy-50 bg-blue-500 dark:bg-blue-700 hover:shadow-lg hover:scale-105">Login</Link>
                <ThemeSwitch></ThemeSwitch>
            </div>
        </div>
    )
}