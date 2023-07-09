"use client";
import Manage2FAComponent from "../components/2fa_management";
export default function Settings() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <Manage2FAComponent></Manage2FAComponent>
        </div>
    )
  }