import { FriendModel, FriendStatus } from "@/app/utils/models";
import Image from "next/image";
import { useState } from 'react';

type FriendProps = {
    friend: FriendModel
}

function getColor(status: FriendStatus) {
    switch (status) {
        case FriendStatus.Online: return "bg-green";
        case FriendStatus.Offline: return "bg-overlay0";
        case FriendStatus.InGame: return "bg-blue";
    }
}

const DropDownMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="relative inline-block text-left">
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
                            Invite to play
                        </button>
                        <button onClick={() => console.log('View Profile')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            View profile
                        </button>
                        <button onClick={() => console.log('Kick')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            Kick
                        </button>
                        <button onClick={() => console.log('Mute')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                            Mute
                        </button>
                        <button onClick={() => console.log('Ban')}
                            className="text-left w-full block px-4 py-2 text-sm hover:bg-red hover:text-mantle rounded-md">
                            Ban
                        </button>
                    </div>
                </div>
            )}
   </div>)
}

// Todo: reduce font size and font weight
const ChatMemberItem = ({friend: {username, status, avatar}} : FriendProps) => {
    
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
             <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    <Image alt="Channel Icon" src={avatar} height={32} width={32}
                        className="w-[inherit] rounded-[inherit]" />

                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getColor(status)}`}></div>
                    </div>
                </div>
                <h1 className="text-sm font-medium pl-[0.15rem]">{username}</h1>
            </div>

            {/* Actions */}
            <DropDownMenu />

            {/* <div id="dropdownDotsHorizontal" className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownMenuIconHorizontalButton">
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
                    </li>
                    <li>
                        <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
                    </li>
                </ul>
                <div className="py-2">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Separated link</a>
                </div>
</div> */}
            {/* Todo: use the same style as discord (...) with pop up menu */}
            {/* <div className="flex justify-between gap-2">
                <button onClick={() => console.log('Invite to game')} className="hover:bg-surface0 rounded-md">
                    <Image src={playImg} height={36} width={36} alt="Invite to game" className='transition-all p-1' />
                </button>
                <button onClick={() => console.log('Remove friend')} className="hover:bg-surface0 rounded-md">
                    <Image src={removeFriendImg} height={36} width={36} alt="Remove Friend" className='transition-all hover:red' />
                </button>
            </div> */}
        </div>
    )
}

export default ChatMemberItem;