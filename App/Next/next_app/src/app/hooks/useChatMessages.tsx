import { useCallback, useEffect, useState } from "react";
import { Author, MessageModel } from "../utils/models";
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
            console.log(`Sending message: ${message}`);
            socket?.emit('message', message);
        }, 
        [socket]
    )
    const FakeAuthor : Author = {
        rgbColor: 'darkorchid',
        username: 'ChatBot',
    }

    useEffect(() => {
        // socket?.on('message', (msg: MessageModel) => {
        // socket?.on('new-message', ({msg, user} : {msg: string, user: any}) => {
        socket?.on('new-message', (content: {message: string, user: any}) => {
            console.log("New message: " + content.message + " from user: " + content.user);
            const newMessage: MessageModel = {
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
            // unsubscribe from the event when unmounting
            console.log(`unsubscribing from new-message event`)
            socket?.off('new-message')
        }
    }, [appendNewMEssage , socket ])

    return {
        messages,
        send,
    }
}