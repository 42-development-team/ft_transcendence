import { ChannelMember } from "@/app/utils/models";
import Image from "next/image";
import ChatMemberActions from "./ChatMemberActions";
import { getStatusColor } from "@/app/utils/getStatusColor";

type ChatMemberProps = {
    user: ChannelMember
    isCurrentUser: boolean
    isBanned?: boolean
    kick: (kickedId: string) => void
    ban: (bannedId: string) => void
    unban: (unbannedId: string) => void
    leaveChannel: () => void
}

// Todo: add status and avatar
const ChatMemberItem = ({ 
    user: { username, avatar, isAdmin, isOwner, id, currentStatus }, 
    isCurrentUser, isBanned, kick, ban, unban, leaveChannel 
}: ChatMemberProps) => {

    const kickUser = () => {
        if (kick == undefined) return;
        kick(id);
    }
    const banUser = () => {
        if (ban == undefined) return;
        ban(id);
    }
    const unbanUser = () => {
        if (unban == undefined) return;
        unban(id);
    }

    return (
        <div className={` ${isCurrentUser && "bg-surface0"}  flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2`}>
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    {avatar.startsWith("https://")
                        ? <Image alt="Member avatar" src={avatar} height={32} width={32}
                            className="w-[inherit] rounded-[inherit]" />
                        : null
                    }
                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[2px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus)}`}></div>
                    </div>
                </div>
                <h1 className={`${isCurrentUser && "text-peach font-semibold"} pl-[0.15rem]`}>{username}</h1>
            </div>
            <ChatMemberActions isCurrentUser={isCurrentUser} isMemberAdmin={isAdmin} isMemberOwner={isOwner} isBanned={isBanned}
                kickUser={kickUser} banUser={banUser} leaveChannel={leaveChannel} userId={id} unbanUser={unbanUser} />
        </div>
    )
}

export default ChatMemberItem;
