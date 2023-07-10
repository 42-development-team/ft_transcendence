"use client";
import TwoFAAuthComponent from "../components/auth/2fa_auth_mangement";
export default function TwoFAAuth() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <TwoFAAuthComponent></TwoFAAuthComponent>
        </div>
    )
  }