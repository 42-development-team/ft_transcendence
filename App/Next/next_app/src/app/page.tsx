"use client";

import './globals.css';
import {useLoggedInContext} from "@/context/LoggedInContextProvider";
import CustomBtn from "@/components/CustomBtn";
import LoginComponent from "@/components/Login";

export default function Home() {
  const {isLoggedIn, login, logout} = useLoggedInContext();
  return (
      <div className="flex flex-col flex-auto items-center justify-center">
          <LoginComponent />
          <CustomBtn onClick={ () => {
              isLoggedIn ? logout() : login();
              console.log(isLoggedIn)
            }}>
            {isLoggedIn ? "<Test> Logout" : "<Test> Login" }
          </CustomBtn>
      </div>
  )
}
