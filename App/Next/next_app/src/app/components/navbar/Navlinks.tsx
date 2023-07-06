"use client";

import Link from "next/link";
import { useLoggedInContext } from '@/context/LoggedInContextProvider';

const NavLinks = () => {
    const {isLoggedIn} = useLoggedInContext();  

    return (
        isLoggedIn ?
        (<div className="px-2 text-xl transition-all">
            <Link href="/profile" className="text-mauve hover:text-pink">Profile</Link>
        </div>) : <></>
    )
}

export default NavLinks;
