"use client";
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { UserModel } from "@/app/utils/models";
import FriendItem from "./FriendItem";
import ChatHeader from "../chat/chatbox/ChatHeader";
import ChatMemberHeader from "../chat/chatbox/members/ChatMemberHeader";
import BlockUserItem from "./BlockUserItem";
import FriendInvite from "./FriendInvite";

interface FriendListProps {
    friends: UserModel[];
    requestedFriends: UserModel[];
    invitedFriends: UserModel[];
    blockedUsers: UserModel[];
    unblockUser: (unblockedId: string) => void;
}

const FriendList = ({friends, requestedFriends, invitedFriends, blockedUsers, unblockUser}: FriendListProps) => {
	const {updateChatBarState} = useChatBarContext();

    const friendsList = friends.map((friend) => {
        return <FriendItem key={friend.id} user={friend}/>
	})

    const blockedList = blockedUsers.map((blockedUser) => (
        <BlockUserItem key={blockedUser.id} user={blockedUser} unblockUser={unblockUser}/>
    ))

    const receivedFriendRequestList = requestedFriends.map((friend) => {
        return <FriendInvite key={friend.id} user={friend}/>
    })

    const invitedFriendsList = invitedFriends.map((friend) => {
        return <FriendInvite key={friend.id} user={friend} hideActions={true}/>
    })

    return (
        <div className='bg-opacity-90 backdrop-blur-lg w-[450px] h-full px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title="Friend List" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
            <div className='overflow-auto h-[86vh]'>
                <ChatMemberHeader>📥 Pending Requests</ChatMemberHeader>
                {receivedFriendRequestList}
                <ChatMemberHeader>⌛ Invited</ChatMemberHeader>
                {invitedFriendsList}
                <ChatMemberHeader>👬 Friends</ChatMemberHeader>
                {friendsList}
                <ChatMemberHeader>🚫 Blocked</ChatMemberHeader>
                {blockedList}
            </div>
        </div>
    )
}

export default FriendList;
