"use client";

import { useState } from "react";

const DropDownActionGame = ({children}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>
            <button type="button"
                className={`text-left text-text w-full block px-4 py-2 text-sm hover:bg-surface1 ` + (isOpen ? "rounded-r-md bg-surface1" : "rounded-md")}
                onClick={() => setIsOpen(!isOpen)}>
                    Invite to play
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-30 right-40 top-[-8.8px] rounded-md rounded-tr-none bg-crust border-[0.15rem] border-surface1">
                    {children}
                </div>
            )}
        </div>
    )
}

export default DropDownActionGame;