"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelMember, ChannelModel, ChannelType, MessageModel, UserStatus } from "../utils/models";
import useSocketConnection from "./useSocketConnection"
import bcrypt from 'bcryptjs';

export interface NewChannelInfo {
    name: string;
    type: string;
    password?: string;
    receiverId?: string;
}

export default function useChannels(userId: string) {
    const socket = useSocketConnection();
    const [channels, setChannels] = useState<ChannelModel[]>([]);
    const [joinedChannels, setJoinedChannels] = useState<ChannelModel[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string>("");

    useEffect(() => {
        fetchChannelsInfo();
        fetchChannelsContent();
    }, []);

    useEffect(() => {
        if (joinedChannels.length > 0) {
            joinPreviousChannels();
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
            return;
        }

        const messageModel: MessageModel = {
            id: newMessage.id,
            createdAt: newMessage.createdAt,
            content: newMessage.content,
            senderId: newMessage.senderId,
            senderUsername: newMessage.sender.username,
        }
        const newChannels = [...joinedChannels];
        if (currentChannelId != newChannels[channelIndex].id) {
            newChannels[channelIndex].unreadMessages++;
        }
        newChannels[channelIndex].messages?.push(messageModel);
        setJoinedChannels(newChannels);
    }

    const handleNewConnectionOnChannel = (body: any) => {
        const { room, user } = body;
        const channelIndex: number = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }

        const newMember: ChannelMember = {
            id: user.id,
            username: user.username,
            isAdmin: user.isAdmin,
            isOwner: user.isOwner,
            isBanned: user.isBanned,
            avatar: user.avatar,
            currentStatus: user.currentStatus,
        }
        const existingMemberIndex = joinedChannels[channelIndex]?.members?.findIndex((member: ChannelMember) => member.id === newMember.id);
        if (existingMemberIndex !== undefined && existingMemberIndex !== -1) {
            const newChannels = [...joinedChannels];
            (newChannels[channelIndex].members as ChannelMember[])[existingMemberIndex] = newMember;
            setJoinedChannels(newChannels);
        }
        else {
            const newChannels = [...joinedChannels];
            newChannels[channelIndex].members?.push(newMember);
            setJoinedChannels(newChannels);
        }
    }

    const handleDisconnectionOnChannel = (body: any) => {
        const { room, userId } = body;
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }
        const newChannels = [...joinedChannels];
        const memberIndex = newChannels[channelIndex].members?.findIndex((member: ChannelMember) => member.id === userId);
        if (memberIndex !== undefined && memberIndex !== -1) {
            newChannels[channelIndex].members?.splice(memberIndex, 1);
        }
        setJoinedChannels(newChannels);
    }

    const handleLeftRoom = (body: any) => {
        const { room } = body;
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }
        fetchChannelsInfo();
        const newChannels = [...joinedChannels];
        newChannels.splice(channelIndex, 1);
        setJoinedChannels(newChannels);
    }

    const handleNewDirectMessageChannel = (body: any) => {
        const { id, name } = body;
        joinChannel(id, name);
    }

    useEffect(() => {
        // Subscribe to socket events
        socket?.on('new-message', (body: any) => {
            receiveMessage(body);
        });
        socket?.on('newConnectionOnChannel', (body: any) => {
            handleNewConnectionOnChannel(body);
        });
        socket?.on('newDisconnectionOnChannel', (body: any) => {
            handleDisconnectionOnChannel(body);
        });
        socket?.on('leftRoom', (body: any) => {
            handleLeftRoom(body);
        });
        socket?.on('NewChatRoom', (body: any) => {
            fetchChannelsInfo();
        });
        socket?.on('directMessage', (body: any) => {
            handleNewDirectMessageChannel(body);
        });

        // return is used for cleanup, remove the socket listener on unmount
        return () => {
            socket?.off('new-message');
            socket?.off('newConnection');
            socket?.off('newDisconnection');
            socket?.off('leftRoom');
            socket?.off('NewChatRoom');
            socket?.off('directMessage');
        }
    }, [socket, joinedChannels, channels]);
    // Note: The useEffect dependency array is needed to avoid memoization of the joinedChannels and channels variables

    const directMessage = async (receiverId: string, senderId: string) =>  {
        const targetChannel = joinedChannels.find(c => 
            c.type == "direct_message" && c.members?.some(member => member.id == receiverId)
        );
        if (targetChannel == undefined) {
            const newChannelId = await createNewChannel({
                name: "direct_message_" + receiverId + "_" + senderId,
                type: ChannelType.DirectMessage,
                receiverId: receiverId.toString(),
            });
            return newChannelId;
        }
        else {
            return targetChannel.id;
        }
    }

    const createNewChannel = async (newChannelInfo: NewChannelInfo): Promise<string> => {
        try {
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
                    receiverId: newChannelInfo.receiverId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create the channel ' + response.statusText);
            }
            const newChannel = await response.json();
            await joinChannel(newChannel.id, newChannel.name, newChannelInfo.password);
            return newChannel.id;
        } catch (error) {
            console.error('error creating channel', error);
        }
        return "";
    }

    const joinChannel = async (id: string, name: string, password?: string): Promise<any> => {
        // Todo: fix catch
        try {
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
        catch (err) {
            console.log("Error joining channel: " + err);
            return err;
        }
    }

    // FETCHING
    const fetchNewChannelContent = async (id: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content/${id}`, { credentials: "include", method: "GET" });
            const channelContent = await response.json();
            const fetchedChannel: ChannelModel = channelContent;
            fetchedChannel.joined = true;
            fetchedChannel.banned = false;
            fetchedChannel.icon = '';
            fetchedChannel.unreadMessages = 0;
            fetchedChannel.members = fetchedChannel.members?.map((member: any) => {
                return {
                    id: member.id,
                    username: member.username,
                    isAdmin: member.isAdmin,
                    isOwner: member.isOwner,
                    isBanned: member.isBanned,
                    avatar: "",
                    // Todo: currentStatus
                    currentStatus: UserStatus.Offline,
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
            if (fetchedChannel.type == ChannelType.DirectMessage) {
                const targetMember = fetchedChannel.members?.find(m => m.id != userId);
                fetchedChannel.directMessageTargetUsername = targetMember?.username;
            }
            setJoinedChannels(prevChannels => [...prevChannels, fetchedChannel]);
        }
        catch (err) {
            console.log("Error fetching channel content: " + err);
        }
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


    const fetchChannelsContent = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
                channel.icon = '';
                channel.joined = false;
                channel.banned = false;
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
                        isBanned: member.isBanned,
                        //Todo: avatar
                        avatar: "",
                    }
                });
                if (channel.type == ChannelType.DirectMessage) {
                    const targetMember = channel.members?.find((m: { id: string; }) => m.id != userId);
                    channel.directMessageTargetUsername = targetMember?.username;
                }
                return channel;
            });
            setJoinedChannels(fetchedChannels);
        }
        catch (err) {
            console.log("Error fetching channel content list: " + err);
        }
    }

    const joinPreviousChannels = useCallback(() => {
        joinedChannels.forEach(channel => {
            if (!channel.joined) {
                socket?.emit("joinRoom", channel.name);
                channel.joined = true;
            }
        });
    }, [socket, joinedChannels]);

    return {
        socket,
        channels,
        joinedChannels,
        createNewChannel,
        joinChannel,
        sendToChannel,
        setCurrentChannelId,
        directMessage,
    }
}
