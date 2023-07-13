"use client";
import React, {useContext, createContext, useState} from "react";

type ChatBarContextType = {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChatVisibility: () => void;
    isFriendListOpen: boolean;
    toggleFriendListVisibility: () => void;
    isChatMembersOpen: boolean;
    toggleChatMembersVisibility: () => void;
}

const ChatBarContextDefaultValues: ChatBarContextType = {
    isChatOpen: false,
    openChat: () => {},
    closeChat: () => {},
    toggleChatVisibility: () => {},
    isFriendListOpen: false,
    toggleFriendListVisibility: () => {},
    isChatMembersOpen: false,
    toggleChatMembersVisibility: () => {},
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isChatOpen, setChatOpen] = useState(false);
    const [isFriendListOpen, setFriendListOpen] = useState(false);
    const [isChatMembersOpen, setChatMembersOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
        if (isFriendListOpen) {
            setFriendListOpen(false);
        }
        setChatMembersOpen(false);
    }
    const closeChat = () => {
        setChatOpen(false);
        setChatMembersOpen(false);
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
            setChatMembersOpen(false);
        }
    }

    const toggleChatMembersVisibility = () => {
        setChatMembersOpen(!isChatMembersOpen);
    }

    return (
        <ChatBarContext.Provider value = {
            {isChatOpen, openChat, closeChat, toggleChatVisibility, isFriendListOpen, toggleFriendListVisibility, isChatMembersOpen: isChatMembersOpen, toggleChatMembersVisibility: toggleChatMembersVisibility}
            }>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);