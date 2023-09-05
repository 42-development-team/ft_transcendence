import { useState, useRef, ReactNode } from 'react';
import { clickOutsideHandler } from '@/app/hooks/clickOutsideHandler';
import Image from "next/image"
import ProfileIcon from "../../../../public/profile-svgrepo-com.svg"

const NavDropDownMenu = ({ children }: { children: ReactNode }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    clickOutsideHandler({ ref: wrapperRef, handler: () => setIsOpen(false) });

    return (
        <div ref={wrapperRef} className="relative inline-block text-left pt-1">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-full px-2 py-2 bg-base 
                            hover:bg-crust hover:scale-105 transform transition"
                onClick={() => setIsOpen(!isOpen)}>
                    <Image src={ProfileIcon} width={26} height={26} alt="Profile" />
            </button>
            {isOpen && 
                <div className="absolute z-10 mt-2 w-40 right-1 rounded-md bg-crust">
                    {children}
                </div>
            }
        </div>
    )
}

export default NavDropDownMenu;