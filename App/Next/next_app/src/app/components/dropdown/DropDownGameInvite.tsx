"use client";

import { useState } from "react";

const DropDownGameInvite = ({children}: any) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>
            <button type="button"
                className="text-left text-text w-full block px-4 py-2 text-sm hover:bg-surface1 rounded-md"
                onClick={() => setIsOpen(!isOpen)}>
                    Invite to play	
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-40 right-1 rounded-md bg-crust">
                    {children}
                </div>
            )}
        </div>
    )
}

export default DropDownGameInvite;