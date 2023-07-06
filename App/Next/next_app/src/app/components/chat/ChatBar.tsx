"use client";
import Image from 'next/image';
import expandImg from "../../../../public/collapse-right-svgrepo-com.svg"
import collapseImg from "../../../../public/collapse-left-svgrepo-com.svg"
import { useState } from 'react';
import ChatEntry from './ChatEntry';

const ChatBar = () => {

    const [isChatOpen, setChatOpen] = useState(false);
    return (
        <div className='flex'>

        <div className="w-16 p-2 bg-surface0 shadow-inner flex flex-col justify-start border-r-2 border-t-2 border-crust">
            <button onClick={() => setChatOpen(!isChatOpen)}>
                <Image src={isChatOpen ? collapseImg : expandImg} height={36} width={36} alt="Collapse" className='m-1'/>
            </button>
        </div>
        {isChatOpen && <ChatContent /> }
        </div>
    )
}
// https://blog.bitsrc.io/building-a-scrollable-chat-box-with-react-b3848a4459fc
const ChatContent = () => {
    return (
        <div className=' overflow-y-scroll flex flex-col place-content-start bg-base w-96 p-2 border-r-2 border-t-2 border-crust'>
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
            <ChatEntry />
        </div>
    )
}

export default ChatBar;