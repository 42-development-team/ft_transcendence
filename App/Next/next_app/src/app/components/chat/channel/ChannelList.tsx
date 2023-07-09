import style from '../Chat.module.css';
import Image from 'next/image';
import expandImg from "../../../../../public/collapse-right-svgrepo-com.svg"
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Channel from "@/components/chat/channel/Channel";
import AddChannel from "./AddChannel";

import testIcon from "../../../../../public/next.svg"
import { useChatContext } from '@/app/context/ChatContextProvider';
import { ChannelModel } from '@/app/utils/models';

const ChannelList = ( {channels} : {channels: ChannelModel[]}) => {
    const {isChatOpen, toggleChatVisibility} = useChatContext();
    const channelsList = channels.map((channel) => (
        <Channel key={channel.id} channel={channel}/>
    ))

    return (
        <div className={style.navChannel} >
            <ul className={style.channelContainer}>
                <button onClick={() => {
                    toggleChatVisibility();
                }}>
                    <Image src={isChatOpen ? collapseImg : expandImg} height={36} width={36} alt="Collapse" className='m-1 transition-all' />
                </button>
                <li className="w-full bg-surface1 h-[2px] rounded-sm mb-4 mt-2"></li>
                {channelsList}
                {/* <Channel channelName={"test"} icon={testIcon2}/>
                <Channel channelName={"A second channel"} icon={testIcon}/>
                <Channel channelName={"A third channel"} icon={testIcon2}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/> */}
                <AddChannel />
            </ul>
        </div>
    )
}

export default ChannelList;