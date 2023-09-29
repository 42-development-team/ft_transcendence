"use client";
import { useEffect, useState } from 'react';
import useChannels from '@/app/hooks/useChannels';
import { ChannelModel, UserModel } from '@/app/utils/models';
import { ChatBarState, useChatBarContext } from '@/app/context/ChatBarContextProvider';
import ChatSideBar from './ChatSideBar';
import ChatMessagesBox from './chatbox/ChatMessageBox';
import FriendList from '../friends/FriendList';
import ChatMemberList from './chatbox/members/ChatMemberList';
import JoinChannel from './channel/JoinChannel';
import CreateChannel from './channel/CreateChannel';
import { UserRoleProvider } from './chatbox/members/UserRoleProvider';
import ChannelSettings from './channel/ChannelSettings';

interface ChatBarProps {
    userId: string;
    friends: UserModel[];
    invitedFriends: UserModel[];
    requestedFriends: UserModel[];
    addFriend: (friendAddingId: string) => void;
    blockedUsers: UserModel[];
    blockUser: (userId: string) => void;
    unblockUser: (userId: string) => void;
}

const Chat = ({ 
    userId, friends, invitedFriends, requestedFriends, addFriend,
    blockedUsers, blockUser, unblockUser }: ChatBarProps) => {
    const { chatBarState, openChannelId, updateChatBarState } = useChatBarContext();
    const {
        channels, joinedChannels,
        createNewChannel, joinChannel, sendToChannel, setCurrentChannelId,
        directMessage
    } = useChannels(userId);
    const [ currentChannel, setCurrentChannel ] = useState<ChannelModel>();
    const [ isCurrentUserAdmin, setIsCurrentUserAdmin ] = useState<boolean>(false);
    const [ isCurrentUserOwner, setIsCurrentUserOwner ] = useState<boolean>(false);

    let currentUser = undefined;

    useEffect(() => {
        setCurrentChannelId(openChannelId);
        if (openChannelId == "" || chatBarState == ChatBarState.Closed) {
            return ;
        }
        setCurrentChannel(joinedChannels.find(channel => channel.id == openChannelId));
    }, [openChannelId, chatBarState, joinedChannels]);

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

    useEffect(() => {
        if ((chatBarState == ChatBarState.ChatOpen || chatBarState == ChatBarState.ChatMembersOpen) && joinedChannels.find(channel => channel.id == openChannelId) == undefined) {
            updateChatBarState(ChatBarState.Closed);
            setCurrentChannelId("");
        }
    }, [joinedChannels]);

    return (
        <div className=' flex h-[calc(100vh-48px)] z-5'>
            <UserRoleProvider isCurrentUserAdmin={isCurrentUserAdmin} isCurrentUserOwner={isCurrentUserOwner}>
                <ChatSideBar channels={joinedChannels} friendRequestCount={requestedFriends.length} />
                {chatBarState == ChatBarState.ChatOpen && currentChannel &&
                    <ChatMessagesBox sendToChannel={sendToChannel} channel={currentChannel} userId={userId} blockedUsers={blockedUsers}/>
                }
                {chatBarState == ChatBarState.ChatMembersOpen && currentChannel &&
                    <ChatMemberList channel={currentChannel} userId={userId} directMessage={directMessage} 
                        blockUser={blockUser} blockedUsers={blockedUsers}
                        addFriend={addFriend}
                        friends={friends} requestedFriends={requestedFriends} invitedFriends={invitedFriends}/>
                }
                {chatBarState == ChatBarState.ChannelSettingsOpen && currentChannel &&
                    <ChannelSettings channel={currentChannel} />
                }
                {chatBarState == ChatBarState.FriendListOpen &&
                    <FriendList friends={friends} blockedUsers={blockedUsers} unblockUser={unblockUser} 
                        requestedFriends={requestedFriends} invitedFriends={invitedFriends}/>
                }
                {chatBarState == ChatBarState.JoinChannelOpen &&
                    <JoinChannel channels={channels} joinChannel={joinChannel}/>
                }
                {chatBarState == ChatBarState.CreateChannelOpen &&
                    <CreateChannel createNewChannel={createNewChannel} />
                }
            </UserRoleProvider>
        </div>
    )
}


export default Chat;
