"use client";
import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import Chat from "@/components/chat/Chat";
import useFriends from "@/hooks/useFriends";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Profile() {
	const { login, userId } = useAuthContext();
	const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser, inviteToPlay } = useFriends();

	useEffect(() => {
		login();
	}, []);

    return ( //create a component for leader/matchhistory + fix z-index of Stats vs DropDownMenu
        <div className="flex w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
            <div className="flex h-[calc(100%-48px)] w-full">
                <div className="mx-[3vw] sm:mx-[7vw] my-[4vw] flex flex-col flex-grow">
                    <StatsWindow userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				        addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} inviteToPlay={inviteToPlay}/>
                    <UnderlineTabs userId={userId} />
                </div>
            </div>
        </div>
    )
}