import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { UserModel } from "@/app/utils/models";
import FriendItem from "./FriendItem";
import ChatHeader from "../chat/chatbox/ChatHeader";
import ChatMemberHeader from "../chat/chatbox/members/ChatMemberHeader";
import BlockUserItem from "./BlockUserItem";

interface FriendListProps {
    friends: UserModel[];
    blockedUsers: UserModel[];
    unblockUser: (unblockedId: string) => void;
}

const FriendList = ({friends, blockedUsers, unblockUser}: FriendListProps) => {

    const {updateChatBarState} = useChatBarContext();

    const friendsList = friends.map((friend) => (
        // Todo: add actions to invite to play, view profile, remove friend
        <FriendItem key={friend.id} user={friend}/>
    ))

    const blockedList = blockedUsers.map((blockedUser) => (
        // Todo: add action to unblock user
        <BlockUserItem key={blockedUser.id} user={blockedUser} unblockUser={unblockUser}/>
    ))
    
    return (
        <div className='w-[450px] h-full px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title="Friend List" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
            <div className='overflow-auto h-[86vh]'>
                <ChatMemberHeader>👬 Friends</ChatMemberHeader>
                {friendsList}
                <ChatMemberHeader>🚫 Blocked</ChatMemberHeader>
                {blockedList}
            </div>
        </div>
    )
}

export default FriendList;