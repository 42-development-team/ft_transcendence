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
    const [channels, setChannels] = useState<ChannelModel[]>([]);
    const [joinedChannels, setJoinedChannels] = useState<ChannelModel[]>([]);

    useEffect(() => {
        fetchChannelsInfo();
        fetchChannelsContent();
    }, []);

    useEffect(() => {
        console.log("Joined channels: " + JSON.stringify(joinedChannels, null, 2));
    }, [joinedChannels]);

    // const socket = useChatConnection();
    // useEffect(() => {
        // Subscribe to channels rooms
    // }, [socket]);

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
            console.log("Error fetching channel info list: " + err);
        }
    };

    const fetchChannelsContent = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
                channel.icon = '';
                return channel;
            });
            setJoinedChannels(fetchedChannels);
        }
        catch (err) {
            console.log("Error fetching channel content list: " + err);
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
            const joinResponse = await fetch(`${process.env.BACK_URL}/chatroom/${newChannel.id}/join`, {
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newChannelInfo }),
            });
        
            if (!joinResponse.ok) {
                console.log('Error joining channel:', await joinResponse.text());
            }
        } catch (error) {
            console.error('error creating channel', error);
        }
    },
        [channels]
    );

    // Messaging
    // Todo: use callback?
    const sendToChannel = (channel: ChannelModel, message: string) => {
        console.log(`Sending message "${message}" to channel ${channel.name}`);
        // socket?.to(channel.name).emit(message);
    }

    return {
        channels,
        joinedChannels,
        createNewChannel,
        fetchChannelsInfo,
        sendToChannel,
    }
}
