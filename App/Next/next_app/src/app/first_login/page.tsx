"use client";
import Navbar from "../components/navbar"
// import defaultAvater from "https://img.freepik.com/free-icon/user_318-563642.jpg'
import Image from 'next/image';

export default function FirstLogin() {
    return (
        <body className="bg-mantle text-text">
            <Navbar displayNavLinks={false}/>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <div className="m-4">
                    <p className="font-bold text-center">Choose your username</p>
                    <input type="text" className="m-2 bg-base border-red  border-0  w-64 h-8 "/>
                </div>
                
                <div className="m-4">
                    <p className="font-bold mb-2">Choose your avatar</p>
                    <Image 
                        src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                        alt="default avatar"
                        width={128}
                        height={128}
                    />
                </div>
                
                <div className="m-4">
                    <label className="">
                        <input type="checkbox" name="2fa" id="2fa" className="mr-2"/>
                        Activate Two-Factor
                    </label>
                </div>
                
                <button
                    className="font-bold text-sm rounded-lg text-base bg-mauve drop-shadow-xl p-3 w-40 m-4" 
                    onClick={ () => console.log("Validate clicked!")}>
                    Validate
                </button>
            </div>
        </body>
    )
  }