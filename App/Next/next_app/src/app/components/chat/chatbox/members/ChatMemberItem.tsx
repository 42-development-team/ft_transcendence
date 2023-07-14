import DropDownMenu from "@/app/components/DropDownMenu";
import { UserModel, UserStatus } from "@/app/utils/models";
import Image from "next/image";

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

// Todo: reduce font size and font weight
const ChatMemberItem = ({friend: {username, status, avatar}} : FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
             <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    <Image alt="Channel Icon" src={avatar} height={32} width={32}
                        className="w-[inherit] rounded-[inherit]" />

                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[2px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getColor(status)}`}></div>
                    </div>
                </div>
                <h1 className="text-sm font-medium pl-[0.15rem]">{username}</h1>
            </div>
            <DropDownMenu />
        </div>
    )
}

export default ChatMemberItem;