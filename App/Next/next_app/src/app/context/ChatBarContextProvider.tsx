"use client";
import React, {useContext, createContext, useState} from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type ChatBarContextType = {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChatVisibility: () => void;
    isFriendListOpen: boolean;
    toggleFriendListVisibility: () => void;
}

const ChatBarContextDefaultValues: ChatBarContextType = {
    isChatOpen: false,
    openChat: () => {},
    closeChat: () => {},
    toggleChatVisibility: () => {},
    isFriendListOpen: false,
    toggleFriendListVisibility: () => {},
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isChatOpen, setChatOpen] = useState(false);
    const [isFriendListOpen, setFriendListOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
        if (isFriendListOpen) {
            setFriendListOpen(false);
        }
    }
    const closeChat = () => {
        setChatOpen(false);
    }

    const toggleChatVisibility = () => {
        setChatOpen(!isChatOpen);
        if (isChatOpen) {
            setFriendListOpen(false);
        }
    }

    const toggleFriendListVisibility = () => {
        setFriendListOpen(!isFriendListOpen);
        if (isChatOpen) {
            setChatOpen(false);
        }
    }

    return (
        <ChatBarContext.Provider value = {{isChatOpen, openChat, closeChat, toggleChatVisibility, isFriendListOpen, toggleFriendListVisibility}}>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);