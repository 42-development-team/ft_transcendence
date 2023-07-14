import DropDownMenu from "@/app/components/dropdown/DropDownMenu";
import {DropDownAction, DropDownActionRed} from "@/app/components/dropdown/DropDownItem";
import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import { getStatusColor } from "@/app/utils/getStatusColor";

type FriendProps = {
    friend: UserModel
}

const ChatMemberActions = () => {
    return (
        <div aria-orientation="vertical" >
            <DropDownAction onClick={() => console.log('Play')}>
                Invite to play
            </DropDownAction>
            <DropDownAction onClick={() => console.log('View Profile')}>
                View profile
            </DropDownAction>
            <DropDownAction onClick={() => console.log('Kick')}>
                Kick
            </DropDownAction>
            <DropDownAction onClick={() => console.log('Mute')}>
                Mute
            </DropDownAction>
            <DropDownActionRed onClick={() => console.log('Ban')}>
                Ban
            </DropDownActionRed>
        </div>
    )
}

const ChatMemberItem = ({friend: {username, status, avatar}} : FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
             <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    <Image alt="Channel Icon" src={avatar} height={32} width={32}
                        className="w-[inherit] rounded-[inherit]" />

                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[2px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    </div>
                </div>
                <h1 className="text-sm font-medium pl-[0.15rem]">{username}</h1>
            </div>
            <DropDownMenu>
                <ChatMemberActions />
            </DropDownMenu>
        </div>
    )
}

export default ChatMemberItem;