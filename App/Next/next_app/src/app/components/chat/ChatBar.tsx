"use client";
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import React from 'react';
import ChatSideBar from './channel/ChatSideBar';
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessagesBox from './ChatMessageBox';
import useChannels from '@/app/hooks/useChannels';
import FriendList from '../friends/FriendList';
import useFriends from '@/app/hooks/useFriends';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {
    const {isChatOpen, isFriendListOpen} = useChatBarContext();
    const {messages} = useChatMessages();
    const {channels} = useChannels();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)
    const {friends} = useFriends();

    return (
        <div className='flex h-full'>
            {/* Chat Side Bar */}
            <ChatSideBar channels={channels} />
            {isChatOpen &&
                    <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} />
            }
            {isFriendListOpen &&
                <FriendList friends={friends} />
            }
        </div>
    )
}


export default ChatBar;