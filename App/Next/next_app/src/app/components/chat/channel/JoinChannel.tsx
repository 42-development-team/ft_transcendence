import { useChatBarContext } from "@/app/context/ChatBarContextProvider";
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { useEffect, useState } from "react";
import ChannelItem from "./ChannelItem";

const JoinChannel = () => {

    const {toggleChannelJoinVisibility} = useChatBarContext();
    const [publicChannels, setPublicChannels] = useState<any[]>([]);
    const [privateChannels, setPrivateChannels] = useState<any[]>([]);

    const getChannels = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const publicChannelsComp = data
            .filter((channel: any) => channel.type === "public")
            .map((channel: any) => (
                <ChannelItem key={channel.id} channel={channel} />
            ));
            const privateChannelsComp = data
                .filter((channel: any) => channel.type === "private")
                .map((channel: any) => (
                    <ChannelItem key={channel.id} channel={channel} />
                ));
            setPublicChannels(publicChannelsComp);
            setPrivateChannels(privateChannelsComp);
        }
        catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getChannels();
    }, [])
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Join a channel
                </span>
                <button onClick={toggleChannelJoinVisibility} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div className='overflow-auto h-[86vh]'>
                
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Public channels 📢
                    </span>
                </div>
                {/* List of public channels */}
                {publicChannels}
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Private channels 🔒
                    </span>
                </div>
                {privateChannels}
                {/* List of private channels */}
            </div>
        </div>
    )
}

export default JoinChannel;