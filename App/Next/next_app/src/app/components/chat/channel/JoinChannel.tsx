import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import collapseImg from "../../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';
import { useEffect, useState } from "react";
import JoinChannelItem from "./JoinChannelItem";
import { ChannelModel } from "@/app/utils/models";

type JoinChannelProps = {
    channels: ChannelModel[],
    joinChannel: (id: string, name:string, password?: string) => Promise<Response>
}

const JoinChannel = ({channels, joinChannel}: JoinChannelProps) => {

    const { updateChatBarState } = useChatBarContext();
    const [publicChannels, setPublicChannels] = useState<any[]>([]);
    const [privateChannels, setPrivateChannels] = useState<any[]>([]);
    const [protectedChannels, setProtectedChannels] = useState<any[]>([]);

    // Todo: add a way to join a secret channel

    const displayChannels = async () => {
        const publicChannelsComp = channels
            .filter((channel: any) => channel.type === "public")
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        const privateChannelsComp = channels
            .filter((channel: any) => channel.type === "private")
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        const protectedChannelsComp = channels
            .filter((channel: any) => channel.type === "protected")
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        setPublicChannels(publicChannelsComp);
        setPrivateChannels(privateChannelsComp);
        setProtectedChannels(protectedChannelsComp);
    }

    useEffect(() => {
        displayChannels();
    }, [])
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Join a channel
                </span>
                <button onClick={() => updateChatBarState(ChatBarState.Closed)} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div className='overflow-auto h-[86vh]'>
                
                <div className='flex items-center justify-around py-2 my-2 '>
                    <span className='font-semibold text-sm'>
                        Public channels 📢
                    </span>
                </div>
                {publicChannels}
                <div className='flex items-center justify-around py-2 my-2 border-t-2 border-mantle'>
                    <span className='font-semibold text-sm'>
                        Protected channels 🔒
                    </span>
                </div>
                {protectedChannels}
            </div>
        </div>
    )
}

export default JoinChannel;