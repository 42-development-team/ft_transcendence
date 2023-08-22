"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelMember, ChannelModel, MessageModel } from "../utils/models";
import useChatConnection from "../hooks/useChatConnection"
import bcrypt from 'bcryptjs';

export interface NewChannelInfo {
    name: string;
    type: string;
    password?: string;
    owner: number;
    admins: number[];
}

export default function useChannels() {
    const socket = useChatConnection();
    const [channels, setChannels] = useState<ChannelModel[]>([]);
    const [joinedChannels, setJoinedChannels] = useState<ChannelModel[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string>("")

    useEffect(() => {
        fetchChannelsInfo();
        fetchChannelsContent();
    }, []);

    useEffect(() => {
        if (joinedChannels.length > 0) {
            joinPreviousChannels();
            // console.log(JSON.stringify(joinedChannels, null, 2));
        }
    }, [joinedChannels]);

    useEffect(() => {
        // Update the notification count to 0 when the channel is open
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.id === currentChannelId);
        if (channelIndex == -1) return;
        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            newChannels[channelIndex].unreadMessages = 0;
            return newChannels;
        });
    }, [currentChannelId])

    // Messaging
    const sendToChannel = useCallback(
        (channel: ChannelModel, message: string) => {
            socket?.emit("message", { message: message, roomId: channel.id });
        }, [socket]
    );

    const receiveMessage = (body: any) => {
        const { newMessage } = body;

        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.id === newMessage.chatRoomId);
        if (channelIndex == -1) {
            console.log("Room not found");
            return;
        }

        const messageModel: MessageModel = {
            id: newMessage.id,
            createdAt: newMessage.createdAt,
            content: newMessage.content,
            senderId: newMessage.senderId,
            senderUsername: newMessage.sender.username,
        }

        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            if (currentChannelId != newChannels[channelIndex].id) {
                newChannels[channelIndex].unreadMessages++;
            }
            newChannels[channelIndex].messages?.push(messageModel);
            return newChannels;
        });
    }

    const handleNewConnectionOnChannel = (body: any) => {
        const { room, user } = body;
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }

        const newMember: ChannelMember = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            isOwner: user.isOwner,
            avatar: user.avatar,
        }
        if (joinedChannels[channelIndex].members?.find((member: ChannelMember) => member.id == newMember.id) != undefined)
            return ;
        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            newChannels[channelIndex].members?.push(newMember);
            return newChannels;
        });
    }

    const handleDisconnectionOnChannel = (body: any) => {
        const { room, user } = body;
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }
        // Remove user from channel
        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            newChannels[channelIndex].members = newChannels[channelIndex].members?.filter((member: ChannelMember) => member.id != user.id);
            return newChannels;
        });
    }

    const handleLeftRoom = (body: any) => {
        const { room } = body;
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }
        // Todo: update channel list display
        fetchChannelsInfo();
        // Remove channel from joined channels
        setJoinedChannels(prevChannels => {
            const newChannels = [...prevChannels];
            newChannels.splice(channelIndex, 1);
            return newChannels;
        });
    }

    useEffect(() => {
        // Subscribe to socket events
        socket?.on('new-message', (body: any) => {
            receiveMessage(body);
        });
        socket?.on('newConnection', (body: any) => {
            handleNewConnectionOnChannel(body);
        });
        socket?.on('newDisconnection', (body: any) => {
            handleDisconnectionOnChannel(body);
        });
        socket?.on('leftRoom', (body: any) => {
            handleLeftRoom(body);
        });
        socket?.on('NewChatRoom', (body: any) => {
            fetchChannelsInfo();
        });

        // return is used for cleanup, remove the socket listener on unmount
        return () => {
            socket?.off('new-message');
            socket?.off('newConnection');
        }
    }, [socket, receiveMessage]);

    const joinPreviousChannels = useCallback(() => {
        joinedChannels.forEach(channel => {
            if (!channel.joined) {
                socket?.emit("joinRoom", channel.name);
                channel.joined = true;
            }
        });
    }, [socket, joinedChannels]);

    // API requests
    const createNewChannel = async (newChannelInfo: NewChannelInfo): Promise<string> => {
        try {
            // Channel creation
			let hashedPassword;
            if (newChannelInfo.password)
                hashedPassword = await bcrypt.hash(newChannelInfo.password, 10);
				let response = await fetch(`${process.env.BACK_URL}/chatroom/new`, {
                credentials: "include",
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
					name: newChannelInfo.name,
					type: newChannelInfo.type,
					hashedPassword: hashedPassword,
					owner: newChannelInfo.owner,
					admins: newChannelInfo.admins,
				}),
            });
            if (!response.ok) {
                throw new Error('Failed to create the channel');
            }
            const newChannel = await response.json();

            // Channel joining
            console.log(JSON.stringify(newChannel, null, 2));
            const joinResponse = await joinChannel(newChannel.id, newChannel.name, newChannelInfo.password);
            return newChannel.id;
        } catch (error) {
            console.error('error creating channel', error);
        }
        return "";
    };

    const joinChannel = async (id: string, name: string, password?: string): Promise<Response> => {
        //Todo: add try catch to prevent console.log.error
        const response = await fetch(`${process.env.BACK_URL}/chatroom/${id}/join`, {
            credentials: "include",
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });
        if (!response.ok) {
            return response;
        }
        socket?.emit("joinRoom", name);
        await fetchNewChannelContent(id);
        await fetchChannelsInfo();
        return response;
    }

    // FETCHING
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

    const fetchNewChannelContent = async (id: string) => {
        const response = await fetch(`${process.env.BACK_URL}/chatroom/content/${id}`, { credentials: "include", method: "GET" });
        const channelContent = await response.json();
        console.log("Channel Content: " + JSON.stringify(channelContent, null, 2));
        const fetchedChannel: ChannelModel = channelContent;
        fetchedChannel.joined = true;
        fetchedChannel.icon = '';
        fetchedChannel.unreadMessages = 0;
        fetchedChannel.members = fetchedChannel.members?.map((member: any) => {
            return {
                id: member.id,
                username: member.username,
                isAdmin: member.isAdmin,
                isOwner: member.isOwner,
                avatar: "",
                // avatar: member.user.avatar,
            }
        });
        fetchedChannel.messages = fetchedChannel.messages?.map((message: any) => {
            return {
                id: message.id,
                createdAt: message.createdAt,
                content: message.content,
                senderId: message.sender.id,
                senderUsername: message.sender.username,
            }
        });
        setJoinedChannels(prevChannels => [...prevChannels, fetchedChannel]);
    }

    const fetchChannelsContent = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
                channel.icon = '';
                channel.joined = false;
                channel.unreadMessages = 0;
                channel.messages = channel.messages.map((message: any) => {
                    return {
                        id: message.id,
                        createdAt: message.createdAt,
                        content: message.content,
                        senderId: message.sender.id,
                        senderUsername: message.sender.username,
                    }
                });
                channel.members = channel.members.map((member: any) => {
                    return {
                        id: member.id,
                        username: member.username,
                        isAdmin: member.isAdmin,
                        isOwner: member.isOwner,
                        //Todo: avatar
                        avatar: "",
                    }
                });
                return channel;
            });
            setJoinedChannels(fetchedChannels);
        }
        catch (err) {
            console.log("Error fetching channel content list: " + err);
        }
    };

    return {
        channels,
        joinedChannels,
        createNewChannel,
        joinChannel,
        sendToChannel,
        socket,
        setCurrentChannelId
    }
}
