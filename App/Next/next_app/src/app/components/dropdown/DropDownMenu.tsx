import { useState, useRef, ReactNode} from 'react';
import { clickOutsideHandler } from '@/app/hooks/clickOutsideHandler';

const DropDownMenu = ({children, width="w-6", height="h-6", color="bg-base", position="right-1"}: {children: ReactNode, width?: string, height?: string, color?: string, position? : string}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    clickOutsideHandler({ref: wrapperRef, handler: () => setIsOpen(false)});

    return (
        <div ref={wrapperRef} className="relative inline-block text-left">
            <button
                type="button"
                className={`inline-flex justify-center w-[80%] rounded-2xl ml-2 px-2 py-2 ${color}`}
                onClick={() => setIsOpen(!isOpen)}>
                <svg className={`${width} ${height} aria-hidden="true" `}  xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path fill="currentColor" d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>
            {isOpen && (
                <div className={`absolute mt-2 w-40 ${position} rounded-md bg-crust z-10`}>
                    {children}
                </div>
            )}
   </div>)
}

export default DropDownMenu;