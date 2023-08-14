"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelModel } from "../utils/models";
import useChatConnection from "../hooks/useChatConnection"

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

    const socket = useChatConnection();
    useEffect(() => {
    }, [socket]);

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

    const fetchSingleChannelContent = async (id: string) => {
        
    };

    // New Channels
    const appendNewChannel = (newChannel: ChannelModel) => {
        newChannel.joined = true;
        newChannel.icon = '';
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    const createNewChannel = async (newChannelInfo: NewChannelInfo) => {
        try {
            // Channel creation
            let response = await fetch(`${process.env.BACK_URL}/chatroom/new`, {
                credentials: "include",
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

            // Channel joining
            const password = newChannelInfo.password;
            const joinResponse = await fetch(`${process.env.BACK_URL}/chatroom/${newChannel.id}/join`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
        
            if (!joinResponse.ok) {
                console.log('Error joining channel:', await joinResponse.text());
                return ;
            }
            socket?.emit("joinRoom", newChannelInfo.name);
            fetchNewChannelContent(newChannel.id);
        } catch (error) {
            console.error('error creating channel', error);
        }
    };

    const fetchNewChannelContent = async (id: string) => {
        const response = await fetch(`${process.env.BACK_URL}/chatroom/content/${id}`, { credentials: "include", method: "GET" });
        const data = await response.json();
        const fetchedChannel: ChannelModel = {
            id: data.id,
            createdAt: data.createdAt,
            creatorId: data.creatorId,
            name: data.name,
            type: data.type,
            members: data.members,
            messages: data.messages,
            icon: '',
            joined: true,
        }
        setJoinedChannels(prevChannels => [...prevChannels, fetchedChannel]);
    }

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
        socket,
    }
}
