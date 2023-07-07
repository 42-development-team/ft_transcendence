import Channel from "@/components/chat/channel/Channel";
import AddChannel from "./AddChannel";

import testIcon from "../../../../../public/next.svg"
import testIcon2 from "../../../../../public/vercel.svg"
import createChannelIcon from "../../../../../public/plus-svgrepo-com.svg"
const ChannelList = () => {

    return (
        <div className="h-full w-full mb-2 mt-2 p-1">
            <ul className="flex flex-col gap-4 items-center">
                <li className="w-full bg-surface1 h-[2px] rounded-sm mb-4 mt-2"></li>
                <Channel channelName={"test"} icon={testIcon2}/>
                <Channel channelName={"A second channel"} icon={testIcon}/>
                <Channel channelName={"A third channel"} icon={testIcon2}/>
                <Channel channelName={"I don't know what to call this one"} icon={testIcon}/>
            <button onClick={() => console.log(`create a new channel`)}>
                <AddChannel />
            </button>
            </ul>
        </div>
    )
}

export default ChannelList;