import Link from "next/link";
import React from "react";

const Navbar = ({displayNavLinks} : {displayNavLinks: boolean}) => {
    return (
        <nav className="flex items-center flex-wrap justify-between bg-base p-1">
            <Logo />
            {displayNavLinks &&<NavLinks />}
        </nav>
    );
};

const Logo = () => {
    return (
        <div className="flex w-fit items-center justify-center gap-2 p-2
            font-bold text-mauve text-2xl">
            <Link href="/">
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