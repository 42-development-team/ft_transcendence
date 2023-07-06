import "../../globals.css";
import Link from "next/link";
import React from "react";
import NavLinks from "@/components/navbar/Navlinks";

const Navbar = () => {
    return (
        <nav className="fixed h-14 bg-base w-full flex flex-nowrap justify-between items-center p-4 mb-2">
        {/* <nav className="flex items-center flex-wrap justify-between bg-base p-1"> */}
            <Logo />
            <NavLinks />
        </nav>
    );
};

const Logo = () => {
    return (
        <div className="flex w-fit p-2 font-bold text-mauve text-2xl  transition-one">
            <Link href="/">
                Pongolin
            </Link>
            <div className="absolute -bottom-1 right-0 w-0 transition-all h-1 bg-yellow"></div>
        </div>
    )
}

export default Navbar;