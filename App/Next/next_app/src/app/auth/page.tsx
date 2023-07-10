"use client";
import Manage2FAComponent from "../components/auth/2fa_settings_management";
export default function TwoFAAuth() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <TwoFAAuthComponent></TwoFAAuthComponent>
        </div>
    )
  }