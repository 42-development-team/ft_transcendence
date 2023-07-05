"use client";
// import defaultAvater from "https://img.freepik.com/free-icon/user_318-563642.jpg'
import Image from 'next/image';

export default function FirstLogin() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="m-4 pt-4">
                <p className="font-bold text-center">Choose your username</p>
                <input type="text" className="m-2 bg-base border-red  border-0  w-64 h-8 "/>
            </div>
                
            <div className="m-4 flex-auto">
                <p className="font-bold mb-2">Choose your avatar</p>
                <Image 
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    alt="default avatar"
                    width={128}
                    height={128}
                    className=" drop-shadow-xl"
                />
            </div>
            
            <div className="m-4 flex flex-auto items-center">
                <label className=" h-4">
                    <input type="checkbox" 
                        name="2fa" id="2fa" 
                        className="w-4 h-4 mr-2  accent-mauve before:accent-lavender unchecked-checkbox"/>
                    Activate Two-Factor
                </label>
                <style jsx>{`
                    .unchecked-checkbox:checked {
                        @apply bg-blue-500;
                    }
                `}</style>

            </div>
            
            <button
                className="font-bold text-base rounded-xl bg-mauve drop-shadow-xl p-3 w-40 m-4 hover:bg-pink" 
                onClick={ () => console.log("Validate clicked!")}>
                Validate
            </button>
        </div>
    )
  }