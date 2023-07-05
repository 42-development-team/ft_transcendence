import Link from "next/link";
import React from "react";

import NavLinks from "./navlinks";

const Navbar = () => {
    return (
        <nav className="flex items-center flex-wrap justify-between bg-base p-1">
            <Logo />
            <NavLinks />
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

export default Navbar;