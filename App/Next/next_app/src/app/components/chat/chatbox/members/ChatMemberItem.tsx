import DropDownMenu from "@/app/components/dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import { ChannelMember } from "@/app/utils/models";
import Image from "next/image";
import { useUserRole } from "./UserRoleProvider";
// import { getStatusColor } from "@/app/utils/getStatusColor";

type ChatMemberActionsProps = {
    isCurrentUser: boolean
    isMemberAdmin: boolean
    isMemberOwner: boolean
}

// Todo: move to a different file
const ChatMemberActions = ({ isCurrentUser, isMemberAdmin, isMemberOwner}: ChatMemberActionsProps) => {
    const { isCurrentUserAdmin, isCurrentUserOwner } = useUserRole();
    return (
        <div aria-orientation="vertical" >
            <DropDownAction onClick={() => console.log('View Profile')}>
                View profile
            </DropDownAction>
            {!isCurrentUser &&
                <DropDownAction onClick={() => console.log('Play')}>
                    Invite to play
                </DropDownAction>
            }
            {!isCurrentUser && isCurrentUserOwner && !isMemberAdmin && 
                <DropDownAction onClick={() => console.log('set as admin')}>
                    Set as admin
                </DropDownAction>
            }
            {!isCurrentUser && !isMemberOwner && (isCurrentUserAdmin || isCurrentUserOwner) &&
                <>
                    <DropDownAction onClick={() => console.log('Kick')}>
                        Kick
                    </DropDownAction>
                    <DropDownAction onClick={() => console.log('Mute')}>
                        Mute
                    </DropDownAction>
                    <DropDownActionRed onClick={() => console.log('Ban')}>
                        Ban
                    </DropDownActionRed>
                </>
            }
            {isCurrentUser &&
                <DropDownActionRed onClick={() => console.log('Leave Channel')}>
                    Leave
                </DropDownActionRed>
            }
        </div>
    )
}

type ChatMemberProps = {
    user: ChannelMember
    isCurrentUser: boolean
}

// Todo: add status and avatar
const ChatMemberItem = ({ user: { username, avatar, isAdmin, isOwner }, isCurrentUser }: ChatMemberProps) => {
    return (
        <div className={` ${isCurrentUser && "bg-surface0"}  flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2`}>
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    {avatar.startsWith("https://")
                        ? <Image alt="Member avatar" src={avatar} height={32} width={32}
                            className="w-[inherit] rounded-[inherit]" />
                        : null
                    }
                    {/* <div className="absolute bg-base p-[2px] rounded-full -bottom-[2px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></div>
                    </div> */}
                </div>
                <h1 className={`${isCurrentUser && "text-peach font-semibold"} pl-[0.15rem]`}>{username}</h1>
            </div>
            <DropDownMenu>
                <ChatMemberActions isCurrentUser={isCurrentUser} isMemberAdmin={isAdmin} isMemberOwner={isOwner} />
            </DropDownMenu>
        </div>
    )
}

export default ChatMemberItem;