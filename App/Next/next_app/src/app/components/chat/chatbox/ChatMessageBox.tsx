"use client";
import { useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatMessage from './ChatMessage';
import { MessageModel } from '@/app/utils/models';
import Image from 'next/image';
import { forwardRef } from 'react';
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import SendMessageForm from './SendMessageForm';
import useChatMessages from '@/app/hooks/useChatMessages';
import style from '../Chat.module.css';

const ChatMessagesBox = forwardRef<HTMLDivElement, {messages: MessageModel[]}> (({ messages }, ref ) => {
    
    const {send} = useChatMessages();
    const MessageList = messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
    ))
    return (
        <div className='w-full max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatMessageBoxHeader />
            <div ref={ref} className='overflow-auto h-[80vh]'>
                {MessageList}
            </div>
            <SendMessageForm onSend={send} className='mt-6 flex flex-row flex-auto justify-between' />
        </div>
    )
});

// Todo: merge with ChatParticipantsHeader
const ChatMessageBoxHeader = () => {
    const {closeChat, toggleChatMembersVisibility: toggleChatParticipantVisibility} = useChatBarContext();
    return (
        <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
            <button onClick={toggleChatParticipantVisibility} >
                <svg viewBox="0 0 24 24" aria-hidden="false" width={"32"} height={"32"} className={`${style.channelIcon}`}>
                    <path fill="currentColor" d="M9.25 4C9.25 2.48122 10.4812 1.25 12 1.25C13.5188 1.25 14.75 2.48122 14.75 4C14.75 5.51878 13.5188 6.75 12 6.75C10.4812 6.75 9.25 5.51878 9.25 4Z" ></path>
                    <path fill="currentColor" d="M8.22309 11.5741L6.04779 10.849C5.42206 10.6404 5 10.0548 5 9.39526C5 8.41969 5.89953 7.69249 6.85345 7.89691L8.75102 8.30353C8.85654 8.32614 8.9093 8.33744 8.96161 8.34826C10.966 8.76286 13.034 8.76286 15.0384 8.34826C15.0907 8.33744 15.1435 8.32614 15.249 8.30353L17.1465 7.8969C18.1005 7.69249 19 8.41969 19 9.39526C19 10.0548 18.5779 10.6404 17.9522 10.849L15.7769 11.5741C15.514 11.6617 15.3826 11.7055 15.2837 11.7666C14.9471 11.9743 14.7646 12.361 14.8182 12.753C14.834 12.8681 14.8837 12.9974 14.9832 13.256L16.23 16.4977C16.6011 17.4626 15.8888 18.4997 14.8549 18.4997C14.3263 18.4997 13.8381 18.2165 13.5758 17.7574L12 14.9997L10.4242 17.7574C10.1619 18.2165 9.67373 18.4997 9.14506 18.4997C8.11118 18.4997 7.39889 17.4626 7.77003 16.4977L9.01682 13.256C9.11629 12.9974 9.16603 12.8681 9.18177 12.753C9.23536 12.361 9.05287 11.9743 8.71625 11.7666C8.61741 11.7055 8.48597 11.6617 8.22309 11.5741Z"></path> 
                </svg>
            </button>
            <span className='font-semibold align-middle pt-2 pr-2'>
                {/* Todo: pick correct channel name */}
                Channel Name
            </span>
            <button onClick={closeChat} >
                <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
            </button>
        </div>
    )
}

export default ChatMessagesBox;