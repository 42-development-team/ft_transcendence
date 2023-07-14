import { UserModel, UserStatus } from "@/app/utils/models";
import Image from "next/image";
import removeFriendImg from "../../../../public/cross-svgrepo-com.svg"
import playImg from "../../../../public/sword-fill-svgrepo-com.svg"

type FriendProps = {
    friend: UserModel
}

function getColor(status: UserStatus) {
    switch (status) {
        case UserStatus.Online: return "bg-green";
        case UserStatus.Offline: return "bg-overlay0";
        case UserStatus.InGame: return "bg-blue";
    }
}

const FriendItem = ({friend: {username, status, avatar}} : FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    <Image alt="Channel Icon" src={avatar} height={32} width={32}
                        className="w-[inherit] rounded-[inherit]" />

                        {/* Status Icon */}
                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getColor(status)}`}></div>
                    </div>
                </div>
                <h1 className="font-medium text-sm">{username}</h1>
            </div>

            {/* Friend Actions */}
            {/* Todo: use the same style as discord (...) with pop up menu */}
            <div className="flex justify-between gap-2">
                <button onClick={() => console.log('Invite to game')} className="hover:bg-surface0 rounded-md">
                    <Image src={playImg} height={36} width={36} alt="Invite to game" className='transition-all p-1' />
                </button>
                <button onClick={() => console.log('Remove friend')} className="hover:bg-surface0 rounded-md">
                    <Image src={removeFriendImg} height={36} width={36} alt="Remove Friend" className='transition-all hover:red' />
                </button>
            </div>
        </div>
    )
}

export default FriendItem;