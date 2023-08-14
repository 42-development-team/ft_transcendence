"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelModel, MessageModel } from "../utils/models";
import useChatConnection from "../hooks/useChatConnection"
import { getRandomValues } from "crypto";

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
        if (joinedChannels.length > 0)
            joinPreviousChannels();
    }, [joinedChannels]);

    const socket = useChatConnection();
    useEffect(() => {
        console.log("subscribe to new message event");
        socket?.on('new-message', (body: any) => {
            handleChannelMessage(body);
        });
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

    const joinPreviousChannels = useCallback(() => {
        console.log("Join previous channels");
        joinedChannels.forEach(channel => {
            console.log("Join channel: " + channel.name);
           socket?.emit("joinRoom", channel.name); 
        });
    }, [socket, joinedChannels]);

    // New Channels
    const appendNewChannel = (newChannel: ChannelModel) => {
        newChannel.joined = true;
        newChannel.icon = '';
        setChannels(prevChannels => [...prevChannels, newChannel]);
    };

    const createNewChannel = async (newChannelInfo: NewChannelInfo): Promise<string> => {
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
            joinChannel(newChannel.id, newChannel.name, newChannelInfo.password);
            return newChannel.id;
        } catch (error) {
            console.error('error creating channel', error);
        }
        return "";
    };

    const joinChannel = async (id: string, name: string, password?: string): Promise<Response> => {
        const response = await fetch(`${process.env.BACK_URL}/chatroom/${id}/join`, {
            credentials: "include",
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        socket?.emit("joinRoom", name);
        if (!response.ok) {
            console.log('Error joining channel:', await response.text());
            return response;
        }
        fetchNewChannelContent(id);
        fetchChannelsInfo();
        return response;
    }

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
        console.log("fetchedChannel: " + JSON.stringify(fetchedChannel, null, 2));
        setJoinedChannels(prevChannels => [...prevChannels, fetchedChannel]);
    }

    // Messaging
    // Todo: use callback?
    const sendToChannel = (channel: ChannelModel, message: string) => {
        console.log(`Sending message "${message}" to channel ${channel.name}`);
        socket?.emit("message", {message: message, room: channel.name});
    }

    const handleChannelMessage = (body: any) => {
        const {message, user, room} = body;
        console.log("new message from " + user.username + " in room " + room + ": " + message);

        // Find the room
        console.log("Joined channels length: " + joinedChannels.length);
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name == room);
        if (channelIndex == -1) {
            console.log("Room not found");
            return ;
        }

        // construct the message
        const newMessage: MessageModel = {
            id: "18",
            createdAt: message.createdAt,
            content: message,
            senderId: user.id,
            senderUsername: user.username,
        };
        
        // add the message to the room
        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            newChannels[channelIndex].messages?.push(newMessage);
            return newChannels;
        });
    }

    return {
        channels,
        joinedChannels,
        createNewChannel,
        joinChannel,
        sendToChannel,
        socket,
    }
}
