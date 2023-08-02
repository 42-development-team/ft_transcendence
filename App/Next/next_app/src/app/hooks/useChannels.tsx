"use client";
import { useCallback, useState } from "react";
import { ChannelModel } from "../utils/models";
import { generateFakeChannel } from "../utils/helpers";

// const fakeChannels: ChannelModel[] = Array(2)
//     .fill(null)
//     .map(() => generateFakeChannel())

export default function useChannels() {
    const [channels, setChannels] = useState<ChannelModel[]>([
        // ...fakeChannels,
    ])

    // const socket = useChatConnection();

    const appendNewChannel = useCallback(
        (newChannel: ChannelModel) => {
            console.error(`append a new channel : ${newChannel.id}`)
            const nextChannels: ChannelModel[] = [
                ...channels,
                newChannel
            ]
            setChannels(nextChannels);
        },
        [channels]
    )

    const createNewChannel = useCallback(
        () => {
            const newChannel: ChannelModel = generateFakeChannel();
            // appendNewChannel(newChannel);
            // socket?.emit('channel', newChannel);
            console.log(`new channel creation ${newChannel.name}`);
        },
        []
    )

    // useEffect(() => {
    //     // socket?.on('new-channel', (chann: ChannelModel) => {
    //     //     appendNewChannel(chann);
    //     // })
    //     return (
    //         console.log("Unsuscribe from new-channel")
    //          socket?.off('new-channel)
    //     )
    // }, [appendNewChannel, socket])

    return {
        channels,
        createNewChannel,
    }
}