"use client";
import Link from "next/link";
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import { DropDownActionLarge, DropDownSeparator } from "../dropdown/DropDownItem";
import NavDropDownMenu from "../dropdown/NavDropDownMenu";
import { useEffect, useState } from "react";
import { useContext } from "react";
import themeContext from "../theme/themeContext";
import React from "react";
import { Theme } from "../theme/Theme";


const Navbar = () => {
    const {isLoggedIn, logout} = useAuthContext();
    return (
        <div className="h-[48px] flex items-center justify-between bg-base p-1 drop-shadow-xl">
            <Logo isLoggedIn={isLoggedIn} />
            {isLoggedIn && <NavLinks logout={logout} />}
        </div>
    );
};

const Logo = ({isLoggedIn} : {isLoggedIn: boolean}) => {
    return (
        <Link className="text-mauve text-2xl font-bold p-2 pt-4" 
            href={isLoggedIn ? "/home" : "/"}>
            Pong
        </Link>
    )
}

const NavLinks = ({logout} : {logout: () => void}) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isButtonClicked, setIsButtonClicked] = useState(false);

    useEffect(() => {
        setIsButtonClicked(false);
    }, [pathname]);

    const goToProfile = () => {
        if (isButtonClicked) return;
        setIsButtonClicked(true);
        if (sessionStorage.getItem("userId"))
            sessionStorage.removeItem("userId");
        router.push('/profile');
    }
    
    return (
        <div className="flex items-center z-100 relative gap-8 px-6 text-lg transition-all">
            <Theme/>
            <NavDropDownMenu>
                <DropDownActionLarge onClick={() => goToProfile()}>
                    Profile
                </DropDownActionLarge >
                <DropDownActionLarge onClick={() => {
                        if (isButtonClicked) return;
                        setIsButtonClicked(true);
                        router.push('/settings')
                    }}>
                    Settings
                </DropDownActionLarge>
                <DropDownSeparator />
                <DropDownActionLarge 
                    onClick={() => {
                        if (isButtonClicked) return;
                        setIsButtonClicked(true);
                        logout();
                        router.push("/");
                    }}>
                    <div className="flex items-center justify-between group">
                        <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" stroke="text" xmlns="http://www.w3.org/2000/svg">
                            <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                            <g id="SVGRepo_iconCarrier">
                                <path d="M15 3H7C5.89543 3 5 3.89543 5 5V19C5 20.1046 5.89543 21 7 21H15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                                <path d="M19 12L15 8M19 12L15 16M19 12H9" stroke="currentColor" fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            </g>
                        </svg>
                        <p className="w-full h-full text-[1rem] ml-2 mr-2">
                            Logout
                        </p>
                    </div>
                </DropDownActionLarge>
            </NavDropDownMenu>
        </div>
    )
}

export default Navbar;