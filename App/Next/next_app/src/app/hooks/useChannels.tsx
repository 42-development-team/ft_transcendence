"use client";
import { useCallback, useEffect, useState } from "react";
import { ChannelMember, ChannelModel, ChannelType, MessageModel, UserStatus } from "../utils/models";
import { useAuthContext } from "../context/AuthContext";
import bcrypt from 'bcryptjs';

export interface NewChannelInfo {
    name: string;
    type: string;
    hashedPassword?: string;
    receiverId?: string;
}

export default function useChannels(userId: string) {
    const { socket } = useAuthContext();
    const [channels, setChannels] = useState<ChannelModel[]>([]);
    const [joinedChannels, setJoinedChannels] = useState<ChannelModel[]>([]);
    const [currentChannelId, setCurrentChannelId] = useState<string>("");

    useEffect(() => {
        fetchChannelsInfo();
        fetchChannelsContent();
    }, [userId]);

    useEffect(() => {
        if (joinedChannels.length > 0 && socket != undefined) {
            joinPreviousChannels();
        }
    }, [joinedChannels, socket]);

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
            isMuted: user.isMuted,
            mutedUntil: user.mutedUntil,
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

    const handleChatroomUpdate = (body: any) => {
        const { room } = body;
        fetchChannelsInfo();
        const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === room);
        if (channelIndex == -1) {
            return;
        }
        fetchChannelContent(joinedChannels[channelIndex].id);
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
        socket?.on('NewChatRoom', () => {
            fetchChannelsInfo();
        });
        socket?.on('directMessage', (body: any) => {
            handleNewDirectMessageChannel(body);
        });
        socket?.on('chatroomUpdate', (body: any) => {
            handleChatroomUpdate(body);
        });

        // return is used for cleanup, remove the socket listener on unmount
        return () => {
            socket?.off('new-message');
            socket?.off('newConnection');
            socket?.off('newDisconnection');
            socket?.off('leftRoom');
            socket?.off('NewChatRoom');
            socket?.off('directMessage');
            socket?.off('chatroomUpdate');
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
        return targetChannel.id;
    }

    const createNewChannel = async (newChannelInfo: NewChannelInfo): Promise<string> => {
        try {
            let hashedPassword;
            if (newChannelInfo.hashedPassword)
                hashedPassword = await bcrypt.hash(newChannelInfo.hashedPassword, 10);
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
            const responseText = await response.json();
            if (responseText == "error") {
                return responseText;
            }
            await joinChannel(responseText.id, responseText.name, newChannelInfo.hashedPassword);
            return responseText.id;
        } catch (error) {
            console.error('error creating channel', error);
        }
        return "";
    }

    const joinChannel = async (id: string, name: string, password?: string): Promise<string> => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${id}/join`, {
                credentials: "include",
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const responseJson = await response.json();
            if (!response.ok || responseJson == "Wrong password") {
                return responseJson;
            }
            socket?.emit("joinRoom", name);
            await fetchChannelContent(id);
            await fetchChannelsInfo();
            return responseJson;
        }
        catch (err : any) {
            console.log("Error joining channel: " + err);
            return err.toString();
        }
    }

    // FETCHING
    const fetchChannelsInfo = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/info`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
                return channel;
            });
            setChannels(fetchedChannels);
        }
        catch (err) {
            console.log("Error fetching channel info list: " + err);
        }
    };

    const fetchChannelContent = async (id: string) => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content/${id}`, { credentials: "include", method: "GET" });
            const channelContent = await response.json();
            const fetchedChannel: ChannelModel = channelContent;
            fetchedChannel.joined = true;
            fetchedChannel.banned = false;
            fetchedChannel.unreadMessages = 0;
            fetchedChannel.members = fetchedChannel.members?.map((member: any) => {
                return {
                    id: member.id,
                    username: member.username,
                    isAdmin: member.isAdmin,
                    isOwner: member.isOwner,
                    isBanned: member.isBanned,
                    isMuted: member.isMuted,
                    mutedUntil: member.mutedUntil,
                    currentStatus: UserStatus.Offline,
                    avatar: member.avatar,
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
            // Search if channel already exists
            const channelIndex = joinedChannels.findIndex((channel: ChannelModel) => channel.name === fetchedChannel.name);
            if (channelIndex == -1) {
                setJoinedChannels(prevChannels => [...prevChannels, fetchedChannel]);
                return;
            }
            const newChannels = [...joinedChannels];
            newChannels[channelIndex] = fetchedChannel;
            setJoinedChannels(newChannels);
        }
        catch (err) {
            console.log("Error fetching channel content: " + err);
        }
    }

    const fetchChannelsContent = async () => {
        try {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/content`, { credentials: "include", method: "GET" });
            const data = await response.json();
            const fetchedChannels: ChannelModel[] = data.map((channel: any) => {
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
                        isMuted: member.isMuted,
                        mutedUntil: member.mutedUntil,
                        avatar: member.avatar,
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
