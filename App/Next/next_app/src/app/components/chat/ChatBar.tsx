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
import ChatMemberList from './chatbox/members/ChatMemberList';
import JoinChannel from './channel/JoinChannel';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {
    const {isChatOpen, isFriendListOpen, isChatMembersOpen, isChannelJoinOpen} = useChatBarContext();
    const {messages, send} = useChatMessages();
    const {channels} = useChannels();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)
    const {friends} = useFriends();

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} />
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
        </div>
    )
}


export default ChatBar;