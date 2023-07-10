"use client";
import Link from "next/link";
import React from "react";
import { useLoggedInContext } from '@/context/LoggedInContextProvider';

const Navbar = () => {
    const {isLoggedIn} = useLoggedInContext();  
    return (
        <nav className="flex items-center flex-wrap justify-between bg-base p-1  drop-shadow-xl">
            <Logo />
            {isLoggedIn && <NavLinks /> }
        </nav>
    );
};

const Logo = () => {
    const {isLoggedIn} = useLoggedInContext();
    return (
        <div className="flex w-fit items-center justify-center gap-2 p-2
            font-bold text-mauve text-2xl">
            <Link href={isLoggedIn ? "/home" : "/"}>
                Pongolin
            </Link>
        </div>
    )
}

const NavLinks = () => {
    return (
        <div className="flex items-center gap-8 px-8 text-xl transition-all">
            <Link href="/profile" className="text-mauve hover:text-pink">Profile</Link>
        </div>
    )
}

export default Navbar;