"use client";
import Link from "next/link";
import React from "react";
import NavLinks from "@/components/navbar/Navlinks";
import { useLoggedInContext } from '@/context/LoggedInContextProvider';

const Navbar = () => {
    return (
        <nav className="flex items-center flex-wrap justify-between bg-base p-1  drop-shadow-xl">
            <Logo />
            <NavLinks />
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

export default Navbar;