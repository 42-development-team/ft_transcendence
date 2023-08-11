"use client";
import { useEffect, useState } from 'react';
import useChatMessages from '@/app/hooks/useChatMessages';
import useChatScrolling from '@/app/hooks/useChatScrolling';
import useChannels from '@/app/hooks/useChannels';
import { ChannelModel } from '@/app/utils/models';
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatSideBar from './ChatSideBar';
import ChatMessagesBox from './chatbox/ChatMessageBox';
import FriendList from '../friends/FriendList';
import useFriends from '@/app/hooks/useFriends';
import ChatMemberList from './chatbox/members/ChatMemberList';
import JoinChannel from './channel/JoinChannel';
import CreateChannel from './channel/CreateChannel';

interface ChatBarProps {
    userId: string;
}

const Chat = ({ userId }: ChatBarProps) => {
    const { chatBarState, openChannelId } = useChatBarContext();
    const { messages, send } = useChatMessages();
    const { chatMessageBoxRef } = useChatScrolling<HTMLDivElement>(messages)
    const { friends } = useFriends();
    const { channels, createNewChannel, fetchChannels } = useChannels();

    const [ currentChannel, setCurrentChannel ] = useState<ChannelModel>();

    useEffect(() => {
        if (openChannelId == "") return ;
        setCurrentChannel(channels.find(channel => channel.id == openChannelId));
        console.log(JSON.stringify(currentChannel));
    }, [openChannelId, chatBarState]);

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} userId={userId} />
            {/* Main Panel */}
            {chatBarState == ChatBarState.ChatOpen &&
                <ChatMessagesBox ref={chatMessageBoxRef} messages={messages} send={send} channelName={currentChannel ? currentChannel.name : ""} />
            }
            {chatBarState == ChatBarState.ChatMembersOpen &&
                <ChatMemberList />
            }
            {chatBarState == ChatBarState.FriendListOpen &&
                <FriendList friends={friends} />
            }
            {chatBarState == ChatBarState.JoinChannelOpen &&
                <JoinChannel channels={channels} fetchChannels={fetchChannels}/>
            }
            {chatBarState == ChatBarState.CreateChannelOpen && 
                <CreateChannel userId={userId} createNewChannel={createNewChannel} />
            }
        </div>
    )
}


export default Chat;