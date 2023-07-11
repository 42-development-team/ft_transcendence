import style from '../Chat.module.css';
import { ChannelModel } from '@/app/utils/models';
import Channel from "@/components/chat/channel/Channel";
import ShowFriends from '../ShowFriends';
import CreateChannel from './CreateChannel';
import Separator from './Separator';
import JoinChannel from './JoinChannel';

const ChannelList = ( {channels} : {channels: ChannelModel[]}) => {
    const channelsList = channels.map((channel) => (
        <Channel key={channel.id} channel={channel}/>
    ))

    return (
        <div className="w-16 bg-base h-full shadow-inner flex flex-col justify-start items-center">
            <div className={style.navChannel} >
                <ul className={style.channelContainer}>
                    <ShowFriends />
                    <JoinChannel />
                    <CreateChannel />
                    <Separator />
                    {channelsList}
                </ul>
            </div>
        </div>
    )
}

export default ChannelList;