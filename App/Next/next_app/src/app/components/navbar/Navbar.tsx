"use client";
import Link from "next/link";
import React from "react";
import { useLoggedInContext } from '@/context/LoggedInContextProvider';
import LogoutIcon from "../../../../public/collapse-right-svgrepo-com.svg";
import Image from "next/image"
import {useRouter } from "next/navigation";

// Todo: pass context to childrens instead of using it everywhere
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
        <div className="flex w-fit items-center justify-center gap-2 p-2 pt-4
            font-bold text-mauve text-2xl">
            <Link href={isLoggedIn ? "/home" : "/"}>
                Pongolin
            </Link>
        </div>
    )
}

const NavLinks = () => {
    const {logout} = useLoggedInContext();
    const router = useRouter();
    return (
        <div className="flex items-center gap-8 px-6 text-lg transition-all">
            <Link href="/profile" className="text-mauve hover:text-pink pt-2">Profile</Link>
            <Link href="/settings" className="text-mauve hover:text-pink pt-2">Settings</Link>
            <button onClick={() => {
                logout();
                router.push("/");
            }}>
                <Image src={LogoutIcon} width={32} height={32} alt="logout"/>
            </button>
        </div>
    )
}

export default Navbar;