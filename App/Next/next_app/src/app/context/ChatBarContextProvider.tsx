"use client";
import React, {useContext, createContext, useState} from "react";

// Todo :use enum in order to avoid boolean hell

type ChatBarContextType = {
    isChatOpen: boolean;
    openChat: () => void;
    closeChat: () => void;
    toggleChatVisibility: () => void;
    isFriendListOpen: boolean;
    toggleFriendListVisibility: () => void;
    isChatMembersOpen: boolean;
    toggleChatMembersVisibility: () => void;
    isChannelJoinOpen: boolean;
    toggleChannelJoinVisibility: () => void;
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
    isChannelJoinOpen: false,
    toggleChannelJoinVisibility: () => {}
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isChatOpen, setChatOpen] = useState(false);
    const [isFriendListOpen, setFriendListOpen] = useState(false);
    const [isChatMembersOpen, setChatMembersOpen] = useState(false);
    const [isChannelJoinOpen, setChannelJoinOpen] = useState(false);

    const openChat = () => {
        setChatOpen(true);
        if (isFriendListOpen) {
            setFriendListOpen(false);
        }
        if (isChannelJoinOpen) {
            setChannelJoinOpen(false);
        }
        setChatMembersOpen(false);
    }
    const closeChat = () => {
        setChatOpen(false);
        setChatMembersOpen(false);
        setChannelJoinOpen(false);
    }

    const toggleChatVisibility = () => {
        setChatOpen(!isChatOpen);
        setFriendListOpen(false);
        setChannelJoinOpen(false);
    }

    const toggleFriendListVisibility = () => {
        setFriendListOpen(!isFriendListOpen);
        setChatOpen(false);
        setChatMembersOpen(false);
        setChannelJoinOpen(false);
    }

    const toggleChannelJoinVisibility = () => {
        setChannelJoinOpen(!isChannelJoinOpen);
        setChatOpen(false);
        setChatMembersOpen(false);
        setFriendListOpen(false);
    }

    const toggleChatMembersVisibility = () => {
        setChatMembersOpen(!isChatMembersOpen);
    }

    return (
        <ChatBarContext.Provider value = {
            {isChatOpen, openChat, closeChat, toggleChatVisibility, isFriendListOpen, toggleFriendListVisibility, isChatMembersOpen, toggleChatMembersVisibility,
            isChannelJoinOpen, toggleChannelJoinVisibility}
            }>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);