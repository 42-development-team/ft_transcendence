"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelModel } from "../utils/models";

export interface NewChannelInfo {
    name: string;
    type: string;
    password?: string;
    owner: number;
    admins: number[];
}

export default function useChannels() {
    // Todo: on mount, fetch channels from server and connect to socket rooms
    const [channels, setChannels] = useState<ChannelModel[]>([]);

    useEffect(() => {
        fetchChannelsInfo();
    }, []);

    const fetchChannelsInfo = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/info`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
                channel.icon = '';
                return channel;
            });
            setChannels(fetchedChannels);
        }
        catch (err) {
            console.log("Error fetching channel list: " + err);
        }
    };

    // New Channels
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
        fetchChannels: fetchChannelsInfo,
    }
}
