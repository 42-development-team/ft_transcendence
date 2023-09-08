import React, { useState } from 'react';
import CreateChannel from './channel/CreateChannel';
import style from './Chat.module.css';
import { ChannelModel } from '@/app/utils/models';
import Channel from '@/components/chat/channel/Channel';
import ShowFriends from '../friends/ShowFriendsButton';
import Separator from './channel/Separator';
import JoinChannelButton from './channel/JoinChannelButton';

const ChatSideBar = ({ channels, userId }: { channels: ChannelModel[]; userId: string }) => {
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  const channelsList = channels.map((channel) => (
    <Channel key={channel.id} channel={channel} />
  ));

  return (
    <div className={style.chatSideBar}>
      <div className={style.channelContainer}>
        {/* Button to toggle the CreateChannel form */}
        <button onClick={() => setShowCreateChannel(true)}>Create a new channel</button>

        {/* Render the rest of the sidebar content when "Create New Channel" form is not open */}
        {!showCreateChannel && (
          <>
            <ShowFriends />
            <JoinChannelButton />
            {channelsList}
          </>
        )}
      </div>
      {/* Hide the separator and channel list when the form is open */}
      {showCreateChannel && (
        <div className={style.createChannelPopup}>
          <CreateChannel userId={userId} onClose={() => setShowCreateChannel(false)} />
        </div>
      )}
    </div>
  );
};

export default ChatSideBar;
