"use client";
import Link from "next/link";
import { useAuthcontext } from '@/app/context/AuthContext';
import { useRouter } from "next/navigation";
import Image from "next/image"
import LogoutIcon from "../../../../public/collapse-right-svgrepo-com.svg";
import { DropDownActionLarge, DropDownSeparator } from "../dropdown/DropDownItem";
import NavDropDownMenu from "../dropdown/NavDropDownMenu";

const Navbar = () => {
    const {isLoggedIn, logout} = useAuthcontext();
    return (
        <div className="h-[4vh] flex items-center justify-between bg-base p-1  drop-shadow-xl">
            <Logo isLoggedIn={isLoggedIn} />
            {isLoggedIn && <NavLinks logout={logout}/> }
        </div>
    );
};

const Logo = ({isLoggedIn} : {isLoggedIn: boolean}) => {
    return (
        <div className="flex w-fit items-center justify-center gap-2 p-2 pt-4
            font-bold text-mauve text-2xl">
            <Link href={isLoggedIn ? "/home" : "/"}>
                Pongolin
            </Link>
        </div>
    )
}

const NavLinks = ({logout} : {logout: () => void}) => {
    const router = useRouter();
    return (
        <div className="flex items-center z-100 relative gap-8 px-6 text-lg transition-all">
            <NavDropDownMenu>
                <div aria-orientation="vertical" >
                    <DropDownActionLarge onClick={() => router.push('/profile')}>
                        Profile
                    </DropDownActionLarge >
                    <DropDownActionLarge onClick={() => router.push('/settings')}>
                        Settings
                    </DropDownActionLarge>
                    <DropDownSeparator />
                    <DropDownActionLarge onClick={() => {
                        logout();
                        router.push("/");
                    }}>
                        <div className="flex items-center justify-between group">
                            <Image src={LogoutIcon} width={28} height={28} alt="logout" />
                            <p className=" w-[100%] h-[100%] text-[1rem] ml-2 mr-2">
                                Logout
                            </p>
                        </div>
                    </DropDownActionLarge>
                </div>
            </NavDropDownMenu>
        </div>
    )
}

export default Navbar;