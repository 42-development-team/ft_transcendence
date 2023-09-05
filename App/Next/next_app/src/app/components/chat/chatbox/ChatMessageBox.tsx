"use client";
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import { ChannelModel, ChannelType, MessageModel } from '@/app/utils/models';
import ChatMessageBoxFooter from './ChatMessageBoxFooter';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import ChatMessage from './ChatMessage';
import ChatHeader from './ChatHeader';
import { Tooltip } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

interface ChatMessagesBoxProps {
    sendToChannel: (Channel: ChannelModel, message: string) => void;
    channel: ChannelModel;
    userId: string;
}


const ChatMessagesBox = ({ sendToChannel, channel, userId }: ChatMessagesBoxProps ) => {
    const {updateChatBarState} = useChatBarContext();
    const [channelTitle, setChannelTitle] = useState<string>(channel.name);
    const [cannotSendMessage, setCannotSendMessage] = useState<boolean>(false);

    const sendMessage = (message: string) => {
        sendToChannel(channel, message);
    }
    if (channel == undefined || channel.messages == undefined) {
        return <></>
    }
    
    const { chatMessageBoxRef } = useChatScrolling<HTMLDivElement>(channel.messages);

    const getColor = (message: MessageModel) => {
        const user = channel.members?.find(member => member.username == message.senderUsername);
        if (user?.isOwner) {
            return 'red';
            // return '#fab387';
        } else if (user?.isAdmin) {
            return 'orange';
        } else if (user?.isBanned) {
            return 'gray';
        }
        return 'text';
    }

    let MessageList = channel.messages?.map((message) => (
        <ChatMessage key={message.id} message={message} color={getColor(message)} />
        ))

    useEffect(() => {
        if (channel.type == ChannelType.DirectMessage && channel.directMessageTargetUsername != undefined)
            setChannelTitle(channel.directMessageTargetUsername);
        else
            setChannelTitle(channel.name);

        const currentUser = channel.members?.find(member => member.id == userId);
        if (currentUser == undefined) return;
        setCannotSendMessage(currentUser.isMuted && Date.now() < Date.parse(currentUser.mutedUntil))
    }, [channel]);

    return (
        <div className='flex flex-col w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title={channelTitle} onCollapse={() => updateChatBarState(ChatBarState.Closed)} >
                {channel.type == ChannelType.DirectMessage ?
                    <div></div>
                    :
                    <ChatMemberButton onClick={() => updateChatBarState(ChatBarState.ChatMembersOpen)} />
                }
            </ChatHeader>
            <div ref={chatMessageBoxRef} className='overflow-auto h-full'>
                {MessageList}
            </div>
            <ChatMessageBoxFooter onSend={sendMessage} channelType={channel.type} cannotSendMessage={cannotSendMessage} />
        </div>
    )
};

const ChatMemberButton = ({onClick}: {onClick: () => void}) => {
    return (
        <Tooltip content="Members" placement="bottom-start" className="tooltip text-text">
            <button onClick={onClick} >
                <svg viewBox="0 0 24 24" aria-hidden="false" width={"32"} height={"32"} >
                    <path fill="currentColor" d="M9.25 4C9.25 2.48122 10.4812 1.25 12 1.25C13.5188 1.25 14.75 2.48122 14.75 4C14.75 5.51878 13.5188 6.75 12 6.75C10.4812 6.75 9.25 5.51878 9.25 4Z" ></path>
                    <path fill="currentColor" d="M8.22309 11.5741L6.04779 10.849C5.42206 10.6404 5 10.0548 5 9.39526C5 8.41969 5.89953 7.69249 6.85345 7.89691L8.75102 8.30353C8.85654 8.32614 8.9093 8.33744 8.96161 8.34826C10.966 8.76286 13.034 8.76286 15.0384 8.34826C15.0907 8.33744 15.1435 8.32614 15.249 8.30353L17.1465 7.8969C18.1005 7.69249 19 8.41969 19 9.39526C19 10.0548 18.5779 10.6404 17.9522 10.849L15.7769 11.5741C15.514 11.6617 15.3826 11.7055 15.2837 11.7666C14.9471 11.9743 14.7646 12.361 14.8182 12.753C14.834 12.8681 14.8837 12.9974 14.9832 13.256L16.23 16.4977C16.6011 17.4626 15.8888 18.4997 14.8549 18.4997C14.3263 18.4997 13.8381 18.2165 13.5758 17.7574L12 14.9997L10.4242 17.7574C10.1619 18.2165 9.67373 18.4997 9.14506 18.4997C8.11118 18.4997 7.39889 17.4626 7.77003 16.4977L9.01682 13.256C9.11629 12.9974 9.16603 12.8681 9.18177 12.753C9.23536 12.361 9.05287 11.9743 8.71625 11.7666C8.61741 11.7055 8.48597 11.6617 8.22309 11.5741Z"></path> 
                </svg>
            </button>
        </Tooltip>
    )
}

export default ChatMessagesBox;