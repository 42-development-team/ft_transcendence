"use client";
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import ChatSideBar from './ChatSideBar';
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessagesBox from './chatbox/ChatMessageBox';
import useChannels from '@/app/hooks/useChannels';
import FriendList from '../friends/FriendList';
import useFriends from '@/app/hooks/useFriends';
import ChatMemberList from './chatbox/members/ChatMemberList';
import JoinChannel from './channel/JoinChannel';
import CreateChannel from './channel/CreateChannel';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

interface ChatBarProps {
    userId: string; // Define the correct type for userId (e.g., string)
  }

const ChatBar = ({ userId }: ChatBarProps) => {
    const {isChatOpen, isFriendListOpen, isChatMembersOpen, isChannelJoinOpen, isCreateChannelOpen } = useChatBarContext();
    const {messages, send} = useChatMessages();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)
    const {friends} = useFriends();
    const {channels, createNewChannel} = useChannels();

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} userId={userId} />
            {/* Main Panel */}
            {isChatOpen && !isChatMembersOpen &&
                <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} send={send} />
            }
            {isChatOpen && isChatMembersOpen &&
                <ChatMemberList />
            }
            {isFriendListOpen &&
                <FriendList friends={friends} />
            }
            {isChannelJoinOpen &&
                <JoinChannel />
            }
            {isCreateChannelOpen && (
                <CreateChannel userId={userId} createNewChannel={createNewChannel}/>
            )}
        </div>
    )
}


export default ChatBar;