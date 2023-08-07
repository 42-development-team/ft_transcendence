"use client";
import { useCallback, useEffect, useState } from "react";
import { MessageModel } from "../utils/models";
import useChatConnection from "./useChatConnection";

const welcomeMessage: MessageModel = {
    id: 'welcome-message',
    author: {
        rgbColor: 'darkorchid',
        username: 'ChatBot',
    },
    content: '👋 Welcome to the Chat 👋',
}

export default function useChatMessages() {
    const [messages, setMessages] = useState<MessageModel[]>([
        welcomeMessage,
    ])

    const socket = useChatConnection();

    const appendNewMEssage = useCallback(
        (newMessage: MessageModel) => {
            const nextMessages: MessageModel[] = [
                ...messages,
                newMessage,
            ]
            setMessages(nextMessages);
        },
        [messages]
    );

    const send = useCallback(
        (message: string) => {
            socket?.emit('message', message);
        }, 
        [socket]
    )

    useEffect(() => {
        socket?.on('new-message', (content: {message: string, user: any}) => {
            const newMessage: MessageModel = {
                // Todo : use correct id
                id: Math.random().toString(36),
                // Todo: manage colors for each user
                author: {
                    rgbColor: 'darkorchid',
                    username: content.user.username,
                },
                content: content.message,
            }
            appendNewMEssage(newMessage);
        })

        return () => {
            socket?.off('new-message')
        }
    }, [appendNewMEssage , socket ])

    return {
        messages,
        send,
    }
}