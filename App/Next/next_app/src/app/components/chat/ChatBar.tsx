"use client";
import SendMessageForm from './SendMessageForm';
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import React from 'react';
import ChannelList from './channel/ChannelList';
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessagesBox from './ChatMessageBox';
import useChannels from '@/app/hooks/useChannels';
import FriendList from '../friends/FriendList';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {
    const {isChatOpen, isFriendListOpen} = useChatBarContext();
    const {messages, send} = useChatMessages();
    const {channels} = useChannels();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)

    return (
        <div className='flex h-full'>
            <ChannelList channels={channels} />
            {isChatOpen &&
                <div className='w-full max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
                    <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} />
                    <SendMessageForm onSend={send} className='mt-6 flex flex-row flex-auto justify-between' />
                </div>
            }
            {isFriendListOpen &&
                <FriendList />
            }
        </div>
    )
}


export default ChatBar;