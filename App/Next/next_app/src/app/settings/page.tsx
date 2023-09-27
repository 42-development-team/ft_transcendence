"use client";
import TwoFA from "@/components/auth/TwoFA";
import SettingsPage from "@/components/settings/settingsPage";
import Chat from "@/components/chat/Chat";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import useFriends from "@/hooks/useFriends";

export default function Settings() {
    const { login, userId } = useAuthContext();
    const { friends, invitedFriends, requestedFriends, addFriend, blockedUsers, blockUser, unblockUser } = useFriends();

    useEffect(() => {
        login();
    }, []);

    return (
        <div className="flex flex-auto w-full h-full">
			<Chat userId={userId} friends={friends} invitedFriends={invitedFriends} requestedFriends={requestedFriends}
				addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser} unblockUser={unblockUser} />
            {userId !== "" && userId !== undefined && userId !== null && 
				<div className="flex flex-col w-full h-[calc(100vh-48px)] justify-center">
				    <SettingsPage userId={userId}></SettingsPage>
				    <div className="flex flex-row justify-center">
					    <TwoFA userId={userId}></TwoFA>
				    </div>
			    </div>
            }
        </div>
    )
}