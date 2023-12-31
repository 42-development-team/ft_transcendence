import { ChannelMember } from "@/app/utils/models";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { useState, useEffect } from "react";
import { UserStatus } from "@/app/utils/models";
import Image from "next/image";
import ChatMemberActions from "./ChatMemberActions";
import { useAuthContext } from "@/app/context/AuthContext";
import { delay } from "@/app/utils/delay";
import { CustomImage } from "@/app/components/CustomImage";

type ChatMemberProps = {
    user: ChannelMember
    isCurrentUser: boolean
	channelId: string
    kick: (kickedId: string) => void
    ban: (bannedId: string) => void
    unban: (unbannedId: string) => void
    leaveChannel: () => void
    directMessage: (targetId: string) => void
    setAsAdmin: (newAdminId: string) => void
    removeAdmin: (removedAdminId: string) => void
    mute: (mutedId: string, muteDuration: number) => void
    addFriend: (friendAddingId: string) => void
    blockUser: (blockedId: string) => void
    isBlocked: boolean
	isFriend: boolean
    isInvitedFriend: boolean
}
const ChatMemberItem = ({
	user,
    isCurrentUser,
    kick, ban, unban, leaveChannel, directMessage, blockUser,
    setAsAdmin, removeAdmin, mute, addFriend, channelId, isBlocked, isFriend, isInvitedFriend
}: ChatMemberProps) => {
	const [userStatus, setUserStatus] = useState(UserStatus.Offline);
	const { socket } = useAuthContext();
	const [ statusChange, setStatusChange ] = useState(false);

    const fetchedUserStatus = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/users/getCurrentStatus/${user.id}`, {
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

	useEffect(() => {
		fetchedUserStatus();
	}, [user.id, statusChange]);

    const statusChangeMonitor = async (userId: string) => {
        await delay(1000);
        const url = new URL(`${process.env.BACK_URL}/chatroom/isMember`);
        url.searchParams.append('userId', userId);
        url.searchParams.append('channelId', channelId);
        const response = await fetch(url.toString(), {
            credentials: "include",
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        });
        const data = await response.json();
        if (data) {
            setStatusChange(usePrevious => !usePrevious);
        }
    };

	useEffect(() => {
		socket?.on("userStatusUpdate", (body: any) => { statusChangeMonitor(body.userId) });

		return () => {
			socket?.off("userStatusUpdate", statusChangeMonitor);
		}
	}, [socket, statusChange])

    const kickUser = () => {
        if (kick == undefined) return;
        kick(user.id);
    }
    const banUser = () => {
        if (ban == undefined) return;
        ban(user.id);
    }
    const unbanUser = () => {
        if (unban == undefined) return;
        unban(user.id);
    }
    const sendDirectMessage = () => {
        if (directMessage == undefined) return;
        directMessage(user.id);
    }

    const setAdmin = () => {
        if (setAsAdmin == undefined) return;
        setAsAdmin(user.id);
    }

    const unsetAdmin = () => {
        if (setAsAdmin == undefined) return;
        removeAdmin(user.id);
    }

    const muteUser = (muteDuration: number) => {
        if (mute == undefined) return;
            mute(user.id, muteDuration);
    }

    const block = () => {
        blockUser(user.id);
    }

    const addAsFriend = () => {
        addFriend(user.id);
    }

    const getColor = () => {
        if (user.isOwner) {
            return 'text-[red]';
        } else if (user.isAdmin) {
            return 'text-[orange]';
        } else if (user.isBanned) {
            return 'text-[gray]';
        }
        return 'text-text';
    }

    return (
        <div className={` ${isCurrentUser && "bg-surface0"} flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2`}>
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    {user.avatar.startsWith("https://")
                        ?
                        <CustomImage url={user.avatar} size={32}/>
                        :
                        <CustomImage size={32}/>
                    }
                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[2px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(userStatus)}`}></div>
                    </div>
                </div>
                <p className={`${getColor()} pl[0.15rem] font-semibold text-md`}>{user.username}</p>
            </div>
            <ChatMemberActions isCurrentUser={isCurrentUser} user={user}
                kickUser={kickUser} banUser={banUser} leaveChannel={leaveChannel}
                unbanUser={unbanUser} sendDirectMessage={sendDirectMessage} muteUser={muteUser}
                setAdmin={setAdmin} unsetAdmin={unsetAdmin} block={block} isBlocked={isBlocked}
				isFriend={isFriend} isInvitedFriend={isInvitedFriend} addAsFriend={addAsFriend} />
        </div>
    )
}

export default ChatMemberItem;
