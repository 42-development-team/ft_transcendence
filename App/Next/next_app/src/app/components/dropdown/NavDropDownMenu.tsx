import { useState, useRef, ReactNode } from 'react';
import { clickOutsideHandler } from '@/app/hooks/clickOutsideHandler';
import Image from "next/image"
import ProfileIcon from "../../../../public/profile-svgrepo-com.svg"
import ProfileIconLight from "../../../../public/profile-light.svg"

const NavDropDownMenu = ({ children }: { children: ReactNode }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    clickOutsideHandler({ ref: wrapperRef, handler: () => setIsOpen(false) });

    return (
        <div ref={wrapperRef} className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-full px-2 py-2 bg-base hover:bg-crust hover:scale-105 transform transition"
                onClick={() => setIsOpen(!isOpen)}>
                    { localStorage.getItem("theme") === "latte" ? (
                        <Image src={ProfileIconLight} width={32} height={32} alt="Profile" />
                    ) : (
                        <Image src={ProfileIcon} width={32} height={32} alt="Profile" />
                    )}
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-40 right-1 rounded-md bg-crust">
                    {children}
                </div>
            )}
        </div>)
}

export default NavDropDownMenu;