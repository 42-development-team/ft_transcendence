import style from './Channel.module.css';
import Channel from "@/components/chat/channel/Channel";
import AddChannel from "./AddChannel";

import testIcon from "../../../../../public/next.svg"
import testIcon2 from "../../../../../public/vercel.svg"

const ChannelList = () => {

    return (
        // <div className="h-full w-full mb-2 mt-2 p-1 ">
        <div className={style.navChannel} >
            {/* <ul className="flex flex-col gap-4 items-center"> */}
            <ul className={style.channelContainer}>
                <li className="w-full bg-surface1 h-[2px] rounded-sm mb-4 mt-2"></li>
                <Channel channelName={"test"} icon={testIcon2}/>
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
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
                <AddChannel />
            </ul>
        </div>
    )
}

export default ChannelList;