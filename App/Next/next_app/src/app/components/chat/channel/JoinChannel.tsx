import { ChannelModel, ChannelType } from "@/app/utils/models";
import { ChatBarState, useChatBarContext } from "@/app/context/ChatBarContextProvider";
import { useEffect, useState } from "react";
import JoinChannelItem from "./JoinChannelItem";
import ChatHeader from "../chatbox/ChatHeader";

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
            .filter((channel: any) => channel.type === ChannelType.Public)
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        const privateChannelsComp = channels
            .filter((channel: any) => channel.type === ChannelType.Private)
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        const protectedChannelsComp = channels
            .filter((channel: any) => channel.type === ChannelType.Protected)
            .map((channel: any) => (
                <JoinChannelItem key={channel.id} channel={channel} joinChannel={joinChannel} />
            ));
        setPublicChannels(publicChannelsComp);
        setPrivateChannels(privateChannelsComp);
        setProtectedChannels(protectedChannelsComp);
    }

    useEffect(() => {
        displayChannels();
    }, [channels])
    
    return (
        <div className='w-full min-w-[450px] h-[96vh] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <ChatHeader title="Join a channel" onCollapse={() => updateChatBarState(ChatBarState.Closed)} />
            <div className='overflow-auto h-[92vh]'>
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