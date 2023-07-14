import { useState, useRef} from 'react';
import { clickOutsideHandler } from '@/app/hooks/clickOutsideHandler';

const DropDownMenu = () => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);

    clickOutsideHandler({ref: wrapperRef, handler: () => setIsOpen(false)});

    return (
        <div ref={wrapperRef} className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-full px-2 py-2 bg-base"
                onClick={() => setIsOpen(!isOpen)}>
                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute z-10 mt-2 w-40 right-1 rounded-md bg-crust">
                    <div className="py-1" aria-orientation="vertical" >
                        <button onClick={() => console.log('Play')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            Invite to play</button>
                        <button onClick={() => console.log('View Profile')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            View profile</button>
                        <button onClick={() => console.log('Kick')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            Kick</button>
                        <button onClick={() => console.log('Mute')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            Mute</button>
                        <button onClick={() => console.log('Ban')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-red hover:text-mantle rounded-md">
                            Ban</button>
                    </div>
                </div>
            )}
   </div>)
}

export default DropDownMenu;