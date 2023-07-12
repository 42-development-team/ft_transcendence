"use client";
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import React from 'react';
import ChatSideBar from './ChatSideBar';
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessagesBox from './chatbox/ChatMessageBox';
import useChannels from '@/app/hooks/useChannels';
import FriendList from '../friends/FriendList';
import useFriends from '@/app/hooks/useFriends';
import ChatParticipants from './chatbox/ChatParticipants';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {
    const {isChatOpen, isFriendListOpen, isChatParticipantOpen} = useChatBarContext();
    const {messages} = useChatMessages();
    const {channels} = useChannels();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)
    const {friends} = useFriends();

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} />
            {/* Main Panel */}
            {isChatOpen && !isChatParticipantOpen &&
                <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} />
            }
            {isChatOpen && isChatParticipantOpen &&
                <ChatParticipants />
            }
            {isFriendListOpen &&
                <FriendList friends={friends} />
            }
        </div>
    )
}


export default ChatBar;