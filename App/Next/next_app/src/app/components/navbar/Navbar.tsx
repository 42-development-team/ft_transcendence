"use client";
import Link from "next/link";
import { useAuthcontext } from '@/app/context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image"
import LogoutIcon from "../../../../public/collapse-right-svgrepo-com.svg";
import LogoutIconLight from "../../../../public/collapse-right-light-theme.svg";
import { DropDownActionLarge, DropDownSeparator } from "../dropdown/DropDownItem";
import NavDropDownMenu from "../dropdown/NavDropDownMenu";
import { useEffect, useState } from "react";

const Navbar = () => {
    const {isLoggedIn, logout} = useAuthcontext();
    return (
        <div className="h-[48px] flex items-center justify-between bg-base p-1 drop-shadow-xl">
            <Logo isLoggedIn={isLoggedIn} />
            {isLoggedIn && <NavLinks logout={logout}/> }
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
                            {localStorage.getItem("theme") === "latte" ? (
                                <Image src={LogoutIconLight} width={28} height={28} alt="logout" />

                            ) : (
                            <Image src={LogoutIcon} width={28} height={28} alt="logout" />
                            )}
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