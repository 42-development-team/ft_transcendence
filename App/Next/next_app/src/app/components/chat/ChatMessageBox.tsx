"use client";
import ChatMessage from './ChatMessage';
import { MessageModel } from '@/app/utils/models';
import React from 'react';

const ChatMessagesBox = React.forwardRef<HTMLDivElement, {messages: MessageModel[]}> (({ messages }, ref ) => {
    const MessageList = messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
    ))
    return (
        <div ref={ref} className='overflow-auto h-[84vh]'>
            {MessageList}
        </div>
    )
})

export default ChatMessagesBox;