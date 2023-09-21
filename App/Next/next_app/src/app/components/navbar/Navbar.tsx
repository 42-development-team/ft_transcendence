"use client";
import Link from "next/link";
import { useAuthContext } from '@/app/context/AuthContext';
import { useRouter, usePathname } from "next/navigation";
import { DropDownActionLarge, DropDownSeparator } from "../dropdown/DropDownItem";
import NavDropDownMenu from "../dropdown/NavDropDownMenu";
import { useContext, useEffect, useState } from "react";
import React from "react";
import { Theme } from "../theme/Theme";
import LoadingContext from "@/app/context/LoadingContext";
import InGameContext from "@/app/context/inGameContext";

const Navbar = () => {
    const { isLoggedIn, logout } = useAuthContext();
    return (
        <div className="h-[48px] flex items-center justify-between bg-base p-1 drop-shadow-xl">
            <Logo isLoggedIn={isLoggedIn} />
            <NavLinks logout={logout} isLoggedIn={isLoggedIn} />
        </div>
    );
};

const Logo = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
    return (
        <Link className="text-mauve text-2xl font-bold p-2 pt-4"
            href={isLoggedIn ? "/home" : "/"}>
            Pong
        </Link>
    )
}

const Loading = () => {
    const { gameLoading } = useContext(LoadingContext);

    return (
        <div>
            {gameLoading  &&  /*window.location.pathname !== "/home" && */
                <div className="flex items-center justify-center h-screen mr-2">
                    <div className="flex shapes-4 text-peach" style={{ opacity: 1 }}></div>
                    <div className="ml-4 flex text-peach">Queue up...</div>
                </div>
            }
        </div>
    )
}

const NavLinks = ({ logout, isLoggedIn }: { logout: () => void, isLoggedIn: Boolean }) => {
    const router = useRouter();
    const pathname = usePathname();
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const { gameLoading, setGameLoading } = useContext(LoadingContext);
    const { inGameContext, setInGameContext } = useContext(InGameContext);
    const { socket, userId} = useAuthContext();

    useEffect(() => {
        socket?.on('isQueued', () => {
            setGameLoading(true);
        });
        socket?.on('isNotQueued', () => {
            setGameLoading(false);
        });
        socket?.on('redirect', (data: any) => {
            setInGameContext(true);
            if (window.location.pathname !== "/home") {
                router.push('/home')
            }
            setGameLoading(false);
            console.log(data);
        });

    }, [socket]);

    useEffect(() => {
        socket?.emit("isUserQueued", parseInt(userId));
    }, [socket]);
    
    useEffect(() => {
        setIsButtonClicked(false);
    }, [pathname]);

    const goToProfile = () => {
        if (isButtonClicked) return;
        setIsButtonClicked(true);
        setInGameContext(false);
        sessionStorage.setItem("userId", userId.toString());
        router.push('/profile');
    }

    return (
        <div className={`${isLoggedIn ? 'px-6' : 'px-2'} flex items-center z-100 relative gap-4 text-lg transition-all`}>
            {gameLoading && <Loading />}
            <Theme />
            {isLoggedIn &&
                <NavDropDownMenu>
                    <DropDownActionLarge onClick={() => goToProfile()}>
                        Profile
                    </DropDownActionLarge >
                    <DropDownActionLarge onClick={() => {
                        setInGameContext(false);
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
            }
        </div>
    )
}

export default Navbar;