import { ChannelMember } from "@/app/utils/models";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { useState, useEffect } from "react";
import { UserStatus } from "@/app/utils/models";
import Image from "next/image";
import ChatMemberActions from "./ChatMemberActions";

type ChatMemberProps = {
    user: ChannelMember
    isCurrentUser: boolean
    isBanned?: boolean
    kick: (kickedId: string) => void
    ban: (bannedId: string) => void
    unban: (unbannedId: string) => void
    leaveChannel: () => void
    directMessage: (targetId: string) => void
    setAsAdmin: (newAdminId: string) => void
    removeAdmin: (removedAdminId: string) => void
}

// Todo: add status and avatar
const ChatMemberItem = ({ 
    user: { username, avatar, isAdmin, isOwner, id, currentStatus }, 
    isCurrentUser, isBanned, 
    kick, ban, unban, leaveChannel, directMessage,
    setAsAdmin, removeAdmin 
}: ChatMemberProps) => {
	const [userStatus, setUserStatus] = useState(UserStatus.Offline);

	useEffect(() => {
		const fetchedUserStatus = async () => {
			try {
				const response = await fetch(`${process.env.BACK_URL}/users/getCurrentStatus/${id}`, {
					// credentials: "include",
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
				});
				const data = await response.json();
				setUserStatus(data);
			} catch (error) {
				console.error('Error fetching user current status');
			}
		};
		fetchedUserStatus();
	}, [id]);

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
    const sendDirectMessage = () => {
        if (directMessage == undefined) return;
        directMessage(id);
    }

    const setAdmin = () => {
        if (setAsAdmin == undefined) return;
        setAsAdmin(id);
    }

    const unsetAdmin = () => {
        if (setAsAdmin == undefined) return;
        removeAdmin(id);
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
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(userStatus)}`}></div>
                    </div>
                </div>
                <h1 className={`${isCurrentUser && "text-peach font-semibold"} pl-[0.15rem]`}>{username}</h1>
            </div>
            <ChatMemberActions isCurrentUser={isCurrentUser} isMemberAdmin={isAdmin} isMemberOwner={isOwner} isBanned={isBanned} userId={id} 
                kickUser={kickUser} banUser={banUser} leaveChannel={leaveChannel} 
                unbanUser={unbanUser} sendDirectMessage={sendDirectMessage}
                setAdmin={setAdmin} unsetAdmin={unsetAdmin} />
        </div>
    )
}

export default ChatMemberItem;
