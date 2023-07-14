import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import DropDownMenu from "../DropDownMenu";
import { getStatusColor } from "@/app/utils/getStatusColor";

type FriendProps = {
    friend: UserModel
}

const FriendActions = () => {
    return (
        <div className="py-1" aria-orientation="vertical" >
            <button onClick={() => console.log('Play')}
                className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                Invite to play</button>
            <button onClick={() => console.log('View Profile')}
                className="text-left w-full block px-4 py-2 text-sm hover:bg-surface0 rounded-md">
                View profile</button>
            <button onClick={() => console.log('Remove Friend')}
                className="text-left w-full block px-4 py-2 text-sm hover:bg-red hover:text-mantle hover:font-semibold rounded-md">
                Remove Friend</button>
        </div>
    )
}

const FriendItem = ({ friend: { username, status, avatar } }: FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    <Image alt="Channel Icon" src={avatar} height={32} width={32}
                        className="w-[inherit] rounded-[inherit]" />
                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    </div>
                </div>
                <h1 className="font-medium text-sm">{username}</h1>
            </div>
            <DropDownMenu >
                <FriendActions />
            </DropDownMenu>
        </div>
    )
}

export default FriendItem;