"use client";
import { useEffect, useState } from 'react';
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
    // const { messages, send, socket } = useChatMessages();
    // const { chatMessageBoxRef } = useChatScrolling<HTMLDivElement>(messages)
    const { friends } = useFriends();
    const { channels, joinedChannels, createNewChannel, fetchChannelsInfo, sendToChannel } = useChannels();
    const [ currentChannel, setCurrentChannel ] = useState<ChannelModel>();

    useEffect(() => {
        if (openChannelId == "" || chatBarState == ChatBarState.Closed) return ;
        setCurrentChannel(joinedChannels.find(channel => channel.id == openChannelId));
    }, [openChannelId, chatBarState]);

    return (
        <div className='flex h-full'>
            <ChatSideBar channels={channels} userId={userId} />
            {/* Main Panel */}
            {chatBarState == ChatBarState.ChatOpen && currentChannel &&
                <ChatMessagesBox sendToChannel={sendToChannel} channel={currentChannel} />
            }
            {chatBarState == ChatBarState.ChatMembersOpen && currentChannel &&
                <ChatMemberList channel={currentChannel}/>
            }
            {chatBarState == ChatBarState.FriendListOpen &&
                <FriendList friends={friends} />
            }
            {chatBarState == ChatBarState.JoinChannelOpen &&
                <JoinChannel channels={channels} fetchChannels={fetchChannelsInfo}/>
            }
            {chatBarState == ChatBarState.CreateChannelOpen && socket &&
                <CreateChannel userId={userId} createNewChannel={createNewChannel} socket={socket} />
            }
        </div>
    )
}


export default Chat;