"use client";
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessage from './ChatMessage';
import { MessageModel } from '@/app/utils/models';
import Image from 'next/image';
import React from 'react';
import collapseImg from "../../../../public/collapse-left-svgrepo-com.svg"
import SendMessageForm from './SendMessageForm';
import useChatMessages from '@/app/hooks/useChatMessages';

const ChatMessagesBox = React.forwardRef<HTMLDivElement, {messages: MessageModel[]}> (({ messages }, ref ) => {
    const {closeChat} = useChatBarContext();
    const {send} = useChatMessages();
    const MessageList = messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
    ))
    return (
        <div className='w-full max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Channel Name
                </span>
                <button onClick={closeChat} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div ref={ref} className=' overflow-auto h-[80vh]'>
                {MessageList}
            </div>
            <SendMessageForm onSend={send} className='mt-6 flex flex-row flex-auto justify-between' />
        </div>
    )
})

export default ChatMessagesBox;