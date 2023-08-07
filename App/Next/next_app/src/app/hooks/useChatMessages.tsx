import { useCallback, useEffect, useState } from "react";
import { generateFakeMessage } from "../utils/helpers";
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

// const fakeMessages: MessageModel[] = Array(20)
//     .fill(null)
//     .map(() => generateFakeMessage())

export default function useChatMessages() {
    const [messages, setMessages] = useState<MessageModel[]>([
        welcomeMessage,
        // ...fakeMessages
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
        socket?.on('new-message', (msg: string) => {
            console.log("New message: " + msg);
            const newMessage: MessageModel = {
                id: Math.random().toString(36),
                author: FakeAuthor,
                content: msg,
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