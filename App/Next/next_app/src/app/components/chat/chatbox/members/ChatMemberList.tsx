"use client";
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel, ChannelType } from '@/app/utils/models';
import ChatMemberHeader from './ChatMemberHeader';
import ChatMemberItem from './ChatMemberItem';
import ChatHeader from '../ChatHeader';
import { Tooltip } from '@material-tailwind/react';
import { useUserRole } from "../members/UserRoleProvider"

interface ChatMemberListProps {
    channel: ChannelModel
    userId: string
    directMessage: (receiverId: string, senderId: string) => Promise<string>
}

// Todo: extract functions to another file
const ChatMemberList = ({ channel, userId, directMessage }: ChatMemberListProps) => {
    const {openChannel, updateChatBarState} = useChatBarContext();
	const channelId = channel.id;
	const channelType = channel.type;
	const { isCurrentUserOwner,isCurrentUserAdmin } = useUserRole();

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

    const InviteFieldButton = () => {
		const { updateChatBarState } = useChatBarContext();
		return (
				<div className="relative flex h-10 w-full min-w-[200px] max-w-[24rem]">
					<input
						type="email"
						className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 pr-20 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-pink-500 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
						placeholder=" "
						required
					/>
					<button
						className="!absolute right-1 top-1 z-10 select-none rounded bg-pink-500 py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-white shadow-md shadow-pink-500/20 transition-all hover:shadow-lg hover:shadow-pink-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none peer-placeholder-shown:pointer-events-none peer-placeholder-shown:bg-blue-gray-500 peer-placeholder-shown:opacity-50 peer-placeholder-shown:shadow-none"
						type="button"
						data-ripple-light="true"
					>
						Invite
					</button>
					<label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-pink-500 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-pink-500 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-pink-500 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
						Username
					</label>
				</div>
			// <Tooltip content="Channel Settings" placement="left" className="tooltip">
			// 	<button className="mt-2 mx-2" type="button" onClick={() => {
			// 		updateChatBarState(ChatBarState.ChannelSettingsOpen)
			// 		console.log("Show channel settings");
			// 	}}>
			// 		<svg viewBox="0 0 24 24" fill="none" width={30} height={30} xmlns="http://www.w3.org/2000/svg">
			// 			<circle cx="12" cy="12" r="3" stroke="#cdd6f4" strokeWidth="1.2"></circle>
			// 			<path d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="#cdd6f4" strokeWidth="1.2"></path>
			// 		</svg>
			// 	</button>
			// </Tooltip>
		)
	}

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
				{/* todo: add icon Font Awsome */}
				{ channelType === ChannelType.Private && (isCurrentUserOwner || isCurrentUserAdmin) &&
                <ChatMemberHeader>👪 Invite to your channel</ChatMemberHeader> }
				{ channelType === ChannelType.Private && (isCurrentUserOwner || isCurrentUserAdmin) &&
                < InviteFieldButton /> }
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
