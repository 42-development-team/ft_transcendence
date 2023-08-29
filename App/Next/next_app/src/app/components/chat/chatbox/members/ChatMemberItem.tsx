import { ChannelMember } from "@/app/utils/models";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { useState, useEffect } from "react";
import { UserStatus } from "@/app/utils/models";
import Image from "next/image";
import ChatMemberActions from "./ChatMemberActions";
import { useAuthcontext } from "@/app/context/AuthContext";
import { usePrevious } from "@material-tailwind/react";

type ChatMemberProps = {
    user: ChannelMember
    isCurrentUser: boolean
    isBanned?: boolean
	channelId: string
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
    setAsAdmin, removeAdmin, channelId
}: ChatMemberProps) => {
	const [userStatus, setUserStatus] = useState(UserStatus.Offline);
	const { socket } = useAuthcontext();
	const [ statusChange, setStatusChange ] = useState(false);

	useEffect(() => {
		const fetchedUserStatus = async () => {
			try {
				const response = await fetch(`${process.env.BACK_URL}/users/getCurrentStatus/${id}`, {
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
	}, [id, statusChange]);

	useEffect(() => {
		console.log("status change: ", statusChange);
	}, [statusChange]);

	useEffect(() => {
		const statusChangeMonitor = async (userId: string) => {
			console.log('User logged in');
			console.log('userId', userId);
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
			console.log("data returned after isMember fetch: ", data);
			if (data) {
				setStatusChange(usePrevious => !usePrevious);
			}
		};

		socket?.on("userLoggedIn", (body: any) => { statusChangeMonitor(body.userId) });
		socket?.on("userLoggedOut", (body: any) => { statusChangeMonitor(body.userId) });

		return () => {
			console.log('Cleanup function called');
			socket?.off("userLoggedIn", statusChangeMonitor);
  			socket?.off("userLoggedOut", statusChangeMonitor);
		}
	}, [socket])

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

    const getColor = () => {
        if (isOwner) {
            return 'text-[#f38ba8]';
            // return '#fab387';
        } else if (isAdmin) {
            return 'text-[#c6a0f6]';
        } else if (isBanned) {
            return 'text-[#838ba7]';
        }
        return 'text-[#f5e0dc]';
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
                <h1 className={`${getColor()} pl[0.15rem] ${isCurrentUser && 'font-semibold'}`}>{username}</h1>
            </div>
            <ChatMemberActions isCurrentUser={isCurrentUser} isMemberAdmin={isAdmin} isMemberOwner={isOwner} isBanned={isBanned} userId={id}
                kickUser={kickUser} banUser={banUser} leaveChannel={leaveChannel}
                unbanUser={unbanUser} sendDirectMessage={sendDirectMessage}
                setAdmin={setAdmin} unsetAdmin={unsetAdmin} />
        </div>
    )
}

export default ChatMemberItem;
