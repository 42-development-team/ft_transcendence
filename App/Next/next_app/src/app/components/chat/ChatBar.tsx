"use client";
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import ChatSideBar from './ChatSideBar';
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
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
    userId: string;
}

const ChatBar = ({ userId }: ChatBarProps) => {
    const { chatBarState } = useChatBarContext();
    const { messages, send } = useChatMessages();
    const { chatMessageBoxRef } = useChatScrolling<HTMLDivElement>(messages)
    const { friends } = useFriends();
    const { channels, createNewChannel, fetchChannels } = useChannels();

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} userId={userId} />
            {/* Main Panel */}
            {chatBarState == ChatBarState.ChatOpen &&
                <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} send={send} />
            }
            {chatBarState == ChatBarState.ChatMembersOpen &&
                <ChatMemberList />
            }
            {chatBarState == ChatBarState.FriendListOpen &&
                <FriendList friends={friends} />
            }
            {chatBarState == ChatBarState.JoinChannelOpen &&
                <JoinChannel channels={channels} fetchChannels={fetchChannels}/>
            }
            {chatBarState == ChatBarState.CreateChannelOpen && (
                <CreateChannel userId={userId} createNewChannel={createNewChannel} />
            )}
        </div>
    )
}


export default ChatBar;