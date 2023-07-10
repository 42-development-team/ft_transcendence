"use client";
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessage from './ChatMessage';
import { MessageModel } from '@/app/utils/models';
import Image from 'next/image';
import React from 'react';
import collapseImg from "../../../../public/collapse-left-svgrepo-com.svg"

const ChatMessagesBox = React.forwardRef<HTMLDivElement, {messages: MessageModel[]}> (({ messages }, ref ) => {
    const {closeChat} = useChatBarContext();
    const MessageList = messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
    ))
    return (
        <div className='flex flex-col'>
            <div className='flex flex-row justify-between w-[inherit] mt-2 mb-2 border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2'>
                    Channel Name
                </span>
                <button onClick={closeChat} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div ref={ref} className='overflow-auto h-[80vh]'>
                {MessageList}
            </div>
        </div>
    )
})

export default ChatMessagesBox;