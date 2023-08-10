"use client";
import { useCallback, useState } from "react";
import { ChannelModel } from "../utils/models";

const testChannel: ChannelModel = {
    id: 'test-channel',
    name: 'test-channel',
    icon: '',
    createdAt: "new Date",
    creatorId: "1",
    type: 'public',
    joined: true,
};

export interface NewChannelInfo {
    name: string;
    type: string;
    password?: string;
    owner: number;
    admins: number[];
}

export default function useChannels() {
    // Todo: on mount, fetch channels from server and connect to socket rooms
    const [channels, setChannels] = useState<ChannelModel[]>([
        testChannel,
    ]);

    const appendNewChannel = (newChannel: ChannelModel) => {
        newChannel.joined = true;
        newChannel.icon = '';
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

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
        } catch (error) {
            console.error('error creating channel', error);
        }
    },
        [channels]
    );
    

    return {
        channels,
        createNewChannel,
    }
}
