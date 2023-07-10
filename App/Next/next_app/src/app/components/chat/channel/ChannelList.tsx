import style from '../Chat.module.css';
import Channel from "@/components/chat/channel/Channel";
import AddChannel from "./AddChannel";

import { ChannelModel } from '@/app/utils/models';
import ShowFriends from '../ShowFriends';

const ChannelList = ( {channels} : {channels: ChannelModel[]}) => {
    const channelsList = channels.map((channel) => (
        <Channel key={channel.id} channel={channel}/>
    ))

    return (
        <div className={style.navChannel} >
            <ul className={style.channelContainer}>
                <ShowFriends />
                <li className="w-full bg-surface1 h-[2px] rounded-sm"></li>
                {channelsList}
                <AddChannel />
            </ul>
        </div>
    )
}

export default ChannelList;