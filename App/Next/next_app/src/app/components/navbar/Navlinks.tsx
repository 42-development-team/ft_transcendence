"use client";

import Link from "next/link";
import { useLoggedInContext } from '../../context/LoggedInContextProvider';

const NavLinks = () => {
    const {isLoggedIn} = useLoggedInContext();  

    return (
        isLoggedIn ?
        (<div className="flex items-center gap-8 px-8 text-xl transition-all">
            <Link href="/profile" className="text-mauve hover:text-pink">Profile</Link>
        </div>) : <></>
    )
}

export default NavLinks;
