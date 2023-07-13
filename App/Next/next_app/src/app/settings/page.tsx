"use client";
import TwoFASettingsManagement from "../components/auth/2faSettingsManagement";
export default function Settings() {
    // const {isLoggedIn, login, logout} = useLoggedInContext();
    return (
        <div className="flex flex-col flex-auto justify-center ">
            <TwoFASettingsManagement></TwoFASettingsManagement>
        </div>
    )
  }