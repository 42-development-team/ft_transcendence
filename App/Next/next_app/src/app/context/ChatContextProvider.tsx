"use client";
import React, {useContext, createContext, useState} from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type ChatContextType = {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChatVisibility: () => void;
}

const ChatContextDefaultValues: ChatContextType = {
    isChatOpen: false,
    openChat: () => {},
    closeChat: () => {},
    toggleChatVisibility: () => {},
}

const ChatContext = createContext<ChatContextType>(ChatContextDefaultValues);

export const ChatContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isChatOpen, setChatOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
    }
    const closeChat = () => {
        setChatOpen(false);
    }

    const toggleChatVisibility = () => {
        setChatOpen(!isChatOpen);
    }

    return (
        <ChatContext.Provider value = {{isChatOpen, openChat, closeChat, toggleChatVisibility}}>
            {children}
        </ChatContext.Provider>
    )
}

export const useChatContext = () => useContext(ChatContext);