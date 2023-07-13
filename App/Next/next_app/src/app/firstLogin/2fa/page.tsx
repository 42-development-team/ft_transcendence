"use client";
import Manage2FAFirstLogin from "@/app/components/auth/2faFirstLoginAuthManagement";
export default function Settings() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto items-center justify-center">
            <Manage2FAFirstLogin></Manage2FAFirstLogin>
       </div>
    )
  }