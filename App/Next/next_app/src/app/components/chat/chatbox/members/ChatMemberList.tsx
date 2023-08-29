"use client";
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel } from '@/app/utils/models';
import ChatMemberHeader from './ChatMemberHeader';
import ChatMemberItem from './ChatMemberItem';
import ChatHeader from '../ChatHeader';
import { Tooltip } from '@material-tailwind/react';

interface ChatMemberListProps {
    channel: ChannelModel
    userId: string
    directMessage: (receiverId: string, senderId: string) => Promise<string>
}

// Todo: extract functions to another file
const ChatMemberList = ({ channel, userId, directMessage }: ChatMemberListProps) => {
    const {openChannel, updateChatBarState} = useChatBarContext();
	const channelId = channel.id;

    // Chat actions functions
    const kick = async (kickedId: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/kick`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({kickedId}),
            });
            if (!response.ok) {
                console.log("Error kicking user: " + response.status);
                // Todo: use alert to inform user
                return;
            }
        }
        catch (error) {
            console.log("Error kicking user: " + error);
                // Todo: use alert to inform user
        }
    }

    const ban = async (bannedId: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/ban`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({bannedId}),
            });
            if (!response.ok) {
                console.log("Error banning user: " + response.status);
                // Todo: use alert to inform user
                return;
            }
        }
        catch (error) {
            console.log("Error banning user: " + error);
                // Todo: use alert to inform user
        }
    }

    const unban = async (unbannedId: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/unban`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({unbannedId}),
            });
            if (!response.ok) {
                console.log("Error unbanning user: " + response.status);
                // Todo: use alert to inform user
                return;
            }
        }
        catch (error) {
            console.log("Error unbanning user: " + error);
                // Todo: use alert to inform user
        }
    }

    const handleDirectMessage = async (receiverId: string) => {
        const id = await directMessage(receiverId, userId);
        openChannel(id);
    }

    const leaveChannel = async () => {
        const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/leave`, {
            credentials: "include",
            method: 'PATCH',
        });
        if (!response.ok) {
            console.log("Error leaving channel: " + response.status);
            return;
        }
    }

    const setAsAdmin = async (newAdminId: string) => {
        // Todo: alerts
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/setAdmin`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({newAdminId}),
            });
            if (!response.ok) {
                console.log("Error setting user as admin: " + response.status);
            }
        }
        catch (error) {
            console.log("Error setting user as admin: " + error);
        }
    }

    const removeAdmin = async (removedAdminId: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${channel.id}/removeAdmin`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({removedAdminId}),
            });
            if (!response.ok) {
                console.log("Error removing admin role: " + response.status);
            }
        }
        catch (error) {
            console.log("Error removing admin role: " + error);
        }
    }


    if (channel == undefined || channel.members == undefined) {
        console.log("Channel is undefined")
        return <></>
    }

    const currentUser = channel.members.find(member => member.id == userId);
    if (currentUser == undefined) {
        console.log("CurrentUser is undefined")
        return <></>
    }

    // Chat member list
    // Todo: sort by ASCII

    // Todo: filter props : ex (admin need remove Admin)
    // ban need remove unban
    const OwnerList = channel.members
        .filter(member => member.isOwner && !member.isBanned)
        .map((member) => (
            <ChatMemberItem key={member.id} user={member} isCurrentUser={member.id == userId}
                kick={kick} ban={ban} unban={unban} leaveChannel={leaveChannel}
                directMessage={handleDirectMessage}
                setAsAdmin={setAsAdmin} removeAdmin={removeAdmin} channelId={channelId}/>
        ))
    const MemberList = channel.members
        .filter(member => !member.isAdmin && !member.isOwner && !member.isBanned)
        .map((member) => (
            <ChatMemberItem key={member.id} user={member} isCurrentUser={member.id == userId}
                kick={kick} ban={ban} unban={unban} leaveChannel={leaveChannel}
                directMessage={handleDirectMessage}
                setAsAdmin={setAsAdmin} removeAdmin={removeAdmin} channelId={channelId}/>
        ))

    const AdminList = channel.members
        .filter(member => member.isAdmin && !member.isOwner && !member.isBanned)
        .map((member) => (
            <ChatMemberItem key={member.id} user={member} isCurrentUser={member.id == userId}
                kick={kick} ban={ban} unban={unban} leaveChannel={leaveChannel}
                directMessage={handleDirectMessage}
                setAsAdmin={setAsAdmin} removeAdmin={removeAdmin} channelId={channelId}/>
        ))

    const BannedList = channel.members
            .filter(member => member.isBanned)
            .map((member) => (
            <ChatMemberItem key={member.id} user={member} isCurrentUser={member.id == userId} isBanned={true}
                kick={kick} ban={ban} unban={unban} leaveChannel={leaveChannel}
                directMessage={handleDirectMessage}
                setAsAdmin={setAsAdmin} removeAdmin={removeAdmin} channelId={channelId}/>
        )
    )

    return (
        <div className='w-full h-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title={channel.name} onCollapse={() => updateChatBarState(ChatBarState.Closed)} >
                <BackToChatButton onClick={() => updateChatBarState(ChatBarState.ChatOpen)} />
            </ChatHeader>
            <div className=' overflow-auto h-[86vh]'>
                <ChatMemberHeader>👑 Owner</ChatMemberHeader>
                {OwnerList}
                <ChatMemberHeader>🛡️ Admin</ChatMemberHeader>
                {AdminList}
                <ChatMemberHeader>👪 Members</ChatMemberHeader>
                {MemberList}
                <ChatMemberHeader>🚫 Banned</ChatMemberHeader>
                {BannedList}
            </div>
        </div>
    )
}
const BackToChatButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <Tooltip content="Chat" placement="bottom-start" className="tooltip">
            <button onClick={onClick} >
                <svg viewBox="0 0 24 24" aria-hidden="false" width={"28"} height={"28"} >
                    <path fill="currentColor" d="M13.0867 21.3877L13.7321 21.7697L13.0867 21.3877ZM13.6288 20.4718L12.9833 20.0898L13.6288 20.4718ZM10.3712 20.4718L9.72579 20.8539H9.72579L10.3712 20.4718ZM10.9133 21.3877L11.5587 21.0057L10.9133 21.3877ZM2.3806 15.9134L3.07351 15.6264V15.6264L2.3806 15.9134ZM7.78958 18.9915L7.77666 19.7413L7.78958 18.9915ZM5.08658 18.6194L4.79957 19.3123H4.79957L5.08658 18.6194ZM21.6194 15.9134L22.3123 16.2004V16.2004L21.6194 15.9134ZM16.2104 18.9915L16.1975 18.2416L16.2104 18.9915ZM18.9134 18.6194L19.2004 19.3123H19.2004L18.9134 18.6194ZM19.6125 2.7368L19.2206 3.37628L19.6125 2.7368ZM21.2632 4.38751L21.9027 3.99563V3.99563L21.2632 4.38751ZM4.38751 2.7368L3.99563 2.09732V2.09732L4.38751 2.7368ZM2.7368 4.38751L2.09732 3.99563H2.09732L2.7368 4.38751ZM9.40279 19.2098L9.77986 18.5615L9.77986 18.5615L9.40279 19.2098ZM13.7321 21.7697L14.2742 20.8539L12.9833 20.0898L12.4412 21.0057L13.7321 21.7697ZM9.72579 20.8539L10.2679 21.7697L11.5587 21.0057L11.0166 20.0898L9.72579 20.8539ZM12.4412 21.0057C12.2485 21.3313 11.7515 21.3313 11.5587 21.0057L10.2679 21.7697C11.0415 23.0767 12.9585 23.0767 13.7321 21.7697L12.4412 21.0057ZM10.5 2.75H13.5V1.25H10.5V2.75ZM21.25 10.5V11.5H22.75V10.5H21.25ZM2.75 11.5V10.5H1.25V11.5H2.75ZM1.25 11.5C1.25 12.6546 1.24959 13.5581 1.29931 14.2868C1.3495 15.0223 1.45323 15.6344 1.68769 16.2004L3.07351 15.6264C2.92737 15.2736 2.84081 14.8438 2.79584 14.1847C2.75041 13.5189 2.75 12.6751 2.75 11.5H1.25ZM7.8025 18.2416C6.54706 18.2199 5.88923 18.1401 5.37359 17.9265L4.79957 19.3123C5.60454 19.6457 6.52138 19.7197 7.77666 19.7413L7.8025 18.2416ZM1.68769 16.2004C2.27128 17.6093 3.39066 18.7287 4.79957 19.3123L5.3736 17.9265C4.33223 17.4951 3.50486 16.6678 3.07351 15.6264L1.68769 16.2004ZM21.25 11.5C21.25 12.6751 21.2496 13.5189 21.2042 14.1847C21.1592 14.8438 21.0726 15.2736 20.9265 15.6264L22.3123 16.2004C22.5468 15.6344 22.6505 15.0223 22.7007 14.2868C22.7504 13.5581 22.75 12.6546 22.75 11.5H21.25ZM16.2233 19.7413C17.4786 19.7197 18.3955 19.6457 19.2004 19.3123L18.6264 17.9265C18.1108 18.1401 17.4529 18.2199 16.1975 18.2416L16.2233 19.7413ZM20.9265 15.6264C20.4951 16.6678 19.6678 17.4951 18.6264 17.9265L19.2004 19.3123C20.6093 18.7287 21.7287 17.6093 22.3123 16.2004L20.9265 15.6264ZM13.5 2.75C15.1512 2.75 16.337 2.75079 17.2619 2.83873C18.1757 2.92561 18.7571 3.09223 19.2206 3.37628L20.0044 2.09732C19.2655 1.64457 18.4274 1.44279 17.4039 1.34547C16.3915 1.24921 15.1222 1.25 13.5 1.25V2.75ZM22.75 10.5C22.75 8.87781 22.7508 7.6085 22.6545 6.59611C22.5572 5.57256 22.3554 4.73445 21.9027 3.99563L20.6237 4.77938C20.9078 5.24291 21.0744 5.82434 21.1613 6.73809C21.2492 7.663 21.25 8.84876 21.25 10.5H22.75ZM19.2206 3.37628C19.7925 3.72672 20.2733 4.20752 20.6237 4.77938L21.9027 3.99563C21.4286 3.22194 20.7781 2.57144 20.0044 2.09732L19.2206 3.37628ZM10.5 1.25C8.87781 1.25 7.6085 1.24921 6.59611 1.34547C5.57256 1.44279 4.73445 1.64457 3.99563 2.09732L4.77938 3.37628C5.24291 3.09223 5.82434 2.92561 6.73809 2.83873C7.663 2.75079 8.84876 2.75 10.5 2.75V1.25ZM2.75 10.5C2.75 8.84876 2.75079 7.663 2.83873 6.73809C2.92561 5.82434 3.09223 5.24291 3.37628 4.77938L2.09732 3.99563C1.64457 4.73445 1.44279 5.57256 1.34547 6.59611C1.24921 7.6085 1.25 8.87781 1.25 10.5H2.75ZM3.99563 2.09732C3.22194 2.57144 2.57144 3.22194 2.09732 3.99563L3.37628 4.77938C3.72672 4.20752 4.20752 3.72672 4.77938 3.37628L3.99563 2.09732ZM11.0166 20.0898C10.8136 19.7468 10.6354 19.4441 10.4621 19.2063C10.2795 18.9559 10.0702 18.7304 9.77986 18.5615L9.02572 19.8582C9.07313 19.8857 9.13772 19.936 9.24985 20.0898C9.37122 20.2564 9.50835 20.4865 9.72579 20.8539L11.0166 20.0898ZM7.77666 19.7413C8.21575 19.7489 8.49387 19.7545 8.70588 19.7779C8.90399 19.7999 8.98078 19.832 9.02572 19.8582L9.77986 18.5615C9.4871 18.3912 9.18246 18.3215 8.87097 18.287C8.57339 18.2541 8.21375 18.2487 7.8025 18.2416L7.77666 19.7413ZM14.2742 20.8539C14.4916 20.4865 14.6287 20.2564 14.7501 20.0898C14.8622 19.936 14.9268 19.8857 14.9742 19.8582L14.2201 18.5615C13.9298 18.7304 13.7204 18.9559 13.5379 19.2063C13.3646 19.4441 13.1864 19.7468 12.9833 20.0898L14.2742 20.8539ZM16.1975 18.2416C15.7862 18.2487 15.4266 18.2541 15.129 18.287C14.8175 18.3215 14.5129 18.3912 14.2201 18.5615L14.9742 19.8582C15.0192 19.832 15.096 19.7999 15.2941 19.7779C15.5061 19.7545 15.7842 19.7489 16.2233 19.7413L16.1975 18.2416Z"></path>
                    <path d="M8 11H8.009M11.991 11H12M15.991 11H16" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
            </button>
        </ Tooltip >
    )
}

export default ChatMemberList;
