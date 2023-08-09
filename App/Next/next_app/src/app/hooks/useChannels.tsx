// "use client";
import { useCallback, useState } from "react";
import { ChannelModel } from "../utils/models";
// import { generateFakeChannel } from "../utils/helpers";

// const fakeChannels: ChannelModel[] = Array(2)
//     .fill(null)
//     .map(() => generateFakeChannel())

export default function useChannels() {

    interface NewChannelInfo {
        name: string;
        type: string;
        password?: string;
        owner: number;
        admins: number[];
    }

    const testChannel: ChannelModel = {
        id: 'test-channel',
        name: 'test-channel',
        icon: '',
        createdAt: "new Date",
        creatorId: "1",
        type: 'public',
        joined: true,
    };
    

    const [channels, setChannels] = useState<ChannelModel[]>([
        testChannel,
    ]);

    const appendNewChannel = useCallback(
        (newChannel: ChannelModel) => {
            console.error(`append a new channel : ${newChannel.id}`);
            const nextChannels: ChannelModel[] = [
                ...channels,
                newChannel
            ];
            setChannels(nextChannels);
        },
        [channels]
    );

    const createNewChannel = useCallback(async (newChannelInfo: NewChannelInfo) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/new`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newChannelInfo),
            });
            if (!response.ok) {
                throw new Error('Failed to create the channel');
            }
            const newChannel = await response.json();
            appendNewChannel(newChannel);
            console.log(`new channel created: ${newChannel.name}`);
        } catch (error) {
            console.error('error creating channel', error);
        }
    },
    [appendNewChannel]
    );


    return {
        channels,
        createNewChannel,
    }
}
