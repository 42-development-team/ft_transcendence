import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { UserModel } from "@/app/utils/models";
import FriendItem from "./FriendItem";
import ChatHeader from "../chat/chatbox/ChatHeader";

const FriendList = ({friends}: {friends: UserModel[]}) => {

    const { updateChatBarState} = useChatBarContext();

    const friendsList = friends.map((friend) => (
        <FriendItem key={friend.id} friend={friend}/>
    ))
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title="Friend List" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
            <div className='overflow-auto h-[86vh]'>
                {friendsList}
            </div>
        </div>
    )
}

export default FriendList;