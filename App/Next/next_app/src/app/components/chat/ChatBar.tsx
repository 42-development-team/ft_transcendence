"use client";
import SendMessageForm from './SendMessageForm';
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import React from 'react';
import ChannelList from './channel/ChannelList';
import { useChatContext } from '@/app/context/ChatContextProvider';
import ChatMessagesBox from './ChatMessageBox';
import useChannels from '@/app/hooks/useChannels';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {
    const {isChatOpen} = useChatContext();
    const {messages, send} = useChatMessages();
    const {channels, createNewChannel} = useChannels();
    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)

    return (
        <div className='flex h-full'>
            <div className="w-16 bg-base h-full shadow-inner flex flex-col justify-start items-center">
                <ChannelList channels={channels} onNewChannel={createNewChannel} />
            </div>
            {isChatOpen && 
            <div className='w-full max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
                <ChatMessagesBox ref={chatMessageBoxRef} messages={messages}/>
                <SendMessageForm onSend={send} className='mt-6 flex flex-row flex-auto justify-between' />
            </div>
            }
        </div>
    )
}


export default ChatBar;