import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { UserModel } from "@/app/utils/models";
import FriendItem from "./FriendItem";
import ChatHeader from "../chat/chatbox/ChatHeader";
import ChatMemberHeader from "../chat/chatbox/members/ChatMemberHeader";

interface FriendListProps {
    friends: UserModel[];
    blockedUsers: UserModel[];
}

const FriendList = ({friends, blockedUsers}: FriendListProps) => {

    const {updateChatBarState} = useChatBarContext();

    const friendsList = friends.map((friend) => (
        // Todo: add actions to invite to play, view profile, remove friend
        <FriendItem key={friend.id} friend={friend}/>
    ))

    const blockedList = blockedUsers.map((blockedUser) => (
        // Todo: add action to unblock user
        <FriendItem key={blockedUser.id} friend={blockedUser}/>
    ))
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
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