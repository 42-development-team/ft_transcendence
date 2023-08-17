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
import { UserRoleProvider } from './chatbox/members/UserRoleProvider';
import ChannelSettings from './channel/ChannelSettings';

interface ChatBarProps {
    userId: string;
}

const Chat = ({ userId }: ChatBarProps) => {
    const { chatBarState, openChannelId } = useChatBarContext();
    const { friends } = useFriends();
    const { channels, joinedChannels, createNewChannel, joinChannel, sendToChannel } = useChannels();
    const [ currentChannel, setCurrentChannel ] = useState<ChannelModel>();
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
    const [isCurrentUserOwner, setIsCurrentUserOwner] = useState<boolean>(false);
    
    let currentUser = undefined;

    useEffect(() => {
        if (openChannelId == "" || chatBarState == ChatBarState.Closed) return ;
        setCurrentChannel(joinedChannels.find(channel => channel.id == openChannelId));
    }, [openChannelId, chatBarState]);

    useEffect(() => {
        currentUser = currentChannel?.members?.find(member => member.id == userId);
        if (currentUser) {
            setIsCurrentUserAdmin(currentUser.isAdmin);
            setIsCurrentUserOwner(currentUser.isOwner);
        }
        else {
            setIsCurrentUserAdmin(false);
            setIsCurrentUserOwner(false);
        }
    }, [currentChannel, userId]);

    return (
        <div className='flex h-full'>
            <UserRoleProvider isCurrentUserAdmin={isCurrentUserAdmin} isCurrentUserOwner={isCurrentUserOwner}>
                <ChatSideBar channels={joinedChannels} userId={userId} />
                {/* Main Panel */}
                {chatBarState == ChatBarState.ChatOpen && currentChannel &&
                    <ChatMessagesBox sendToChannel={sendToChannel} channel={currentChannel} />
                }
                {chatBarState == ChatBarState.ChatMembersOpen && currentChannel &&
                    <ChatMemberList channel={currentChannel} userId={userId}/>
                }
                {chatBarState == ChatBarState.ChannelSettingsOpen && currentChannel &&
                    <ChannelSettings channel={currentChannel} />
                }
                {chatBarState == ChatBarState.FriendListOpen &&
                    <FriendList friends={friends} />
                }
                {chatBarState == ChatBarState.JoinChannelOpen &&
                    <JoinChannel channels={channels} joinChannel={joinChannel}/>
                }
                {chatBarState == ChatBarState.CreateChannelOpen &&
                    <CreateChannel userId={userId} createNewChannel={createNewChannel} />
                }
            </UserRoleProvider>
        </div>
    )
}


export default Chat;