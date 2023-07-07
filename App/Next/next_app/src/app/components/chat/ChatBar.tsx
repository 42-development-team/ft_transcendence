"use client";
import Image from 'next/image';
import expandImg from "../../../../public/collapse-right-svgrepo-com.svg"
import collapseImg from "../../../../public/collapse-left-svgrepo-com.svg"
import { useState } from 'react';
import SendMessageForm from './SendMessageForm';
import useChatMessages from '@/app/hooks/useChatMessages';
import ChatMessage from './ChatMessage';
import { MessageModel } from '@/app/utils/models';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import React from 'react';

// Todo: do we need an emoji-picker ?
// https://youtu.be/U2XnoKzxmeY?t=1605

const ChatBar = () => {

    const [isChatOpen, setChatOpen] = useState(false);
    const {messages, send} = useChatMessages();

    const {chatMessageBoxRef} = useChatScrolling<HTMLDivElement>(messages)

    return (
        <div className='flex h-full'>
            <div className="w-16 p-2 bg-base shadow-inner flex flex-col justify-start">
                <button onClick={() => {
                    setChatOpen(!isChatOpen);
                }}>
                    <Image src={isChatOpen ? collapseImg : expandImg} height={36} width={36} alt="Collapse" className='m-1' />
                </button>
            </div>
            {isChatOpen && 
                // <div className='w-full max-w-[45t0px] flex flex-col px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
                <div className='w-full max-w-[45t0px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
                    <ChatMessagesBox ref={chatMessageBoxRef} messages={messages}/>
                    <SendMessageForm onSend={send} className='mt-6 flex flex-row flex-auto justify-between' />
                </div>
            }
        </div>
    )
}

const ChatMessagesBox = React.forwardRef<HTMLDivElement, {messages: MessageModel[]}> (({ messages }, ref ) => {
    const MessageList = messages.map((message) => (
        <ChatMessage key={message.id} className='mb-1' message={message} />
    ))
    return (
        <div ref={ref} className='overflow-auto h-[84vh]'>
            {MessageList}
        </div>
    )
})

export default ChatBar;