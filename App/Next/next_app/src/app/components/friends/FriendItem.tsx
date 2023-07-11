import { FriendModel, FriendStatus } from "@/app/utils/models";
import Image from "next/image";

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

const FriendItem = ({friend: {username, status, avatar}} : FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center mt-2 mb-2 hover:bg-surface2 rounded py-1 px-2">
            <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                <Image alt="Channel Icon" src={avatar}
                    height={32} width={32}
                    className="w-[inherit] rounded-[inherit]" />
                <div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
                    <div className={`w-3 h-3 rounded-full ${getColor(status)}`}></div>
                </div>
            </div>
            <h1 className="font-semibold cursor-pointer">{username}</h1>
        </div>
    )
}

export default FriendItem;