import { useState, useRef, ReactNode} from 'react';
import { clickOutsideHandler } from '@/app/hooks/clickOutsideHandler';

const DropDownMenu = ({children}: {children: ReactNode}) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    clickOutsideHandler({ref: wrapperRef, handler: () => setIsOpen(false)});

    return (
        <div ref={wrapperRef} className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-2xl px-2 py-2 bg-base"
                onClick={() => setIsOpen(!isOpen)}>
                <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path fill="currentColor" d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-40 right-1 rounded-md bg-crust">
                    {children}
                </div>
            )}
   </div>)
}

export default DropDownMenu;