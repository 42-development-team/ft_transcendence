"use client";
import React, {useContext, createContext, useState} from "react";

// Note: we also need username ? Replace "PROFILE" text by "username"
type ChatBarContextType = {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChatVisibility: () => void;
}

const ChatBarContextDefaultValues: ChatBarContextType = {
    isChatOpen: false,
    openChat: () => {},
    closeChat: () => {},
    toggleChatVisibility: () => {},
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
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
        <ChatBarContext.Provider value = {{isChatOpen, openChat, closeChat, toggleChatVisibility}}>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);