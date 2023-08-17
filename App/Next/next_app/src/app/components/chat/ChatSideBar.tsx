import { useEffect, useState } from 'react';
import style from './Chat.module.css';
import { ChannelModel } from '@/app/utils/models';
import Channel from '@/components/chat/channel/Channel';
import ShowFriends from '../friends/ShowFriendsButton';
import Separator from './channel/Separator';
import JoinChannelButton from './channel/JoinChannelButton';
import CreateChannelButton from './channel/CreateChannelButton';

const ChatSideBar = ({ channels, userId }: { channels: ChannelModel[]; userId: string }) => {
  const [channelsList, setChannelsList] = useState<any[]>([]);

  const updateDisplay = () => {
    const channelsList = channels
      .map((channel) => (
        <Channel key={channel.id} channel={channel} />
      ));
    console.log(JSON.stringify(channels));
    setChannelsList(channelsList);
  }

  useEffect(() => {
    updateDisplay();
  }, [channels]);

  return (
    <div className="w-16 min-w-[4rem] bg-base h-full shadow-inner flex flex-col justify-start items-center">
      <div className={style.navChannel} >
        <ul className={style.channelContainer}>
          <ShowFriends />
          <JoinChannelButton />
          <CreateChannelButton />
          <Separator />
          {channelsList}
        </ul>
      </div>
    </div>
  );
};

export default ChatSideBar;
