"use client";
import Enable2FAComponent from "@/components/2fa_status";
export default function Settings() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <Enable2FAComponent></Enable2FAComponent>
        </div>
    )
  }