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
    isCreateChannelOpen: boolean;
    toggleCreateChannelVisibility: () => void;
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
    toggleChannelJoinVisibility: () => {},
    isCreateChannelOpen: false,
    toggleCreateChannelVisibility: () => {},

}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [isChatOpen, setChatOpen] = useState(false);
    const [isFriendListOpen, setFriendListOpen] = useState(false);
    const [isChatMembersOpen, setChatMembersOpen] = useState(false);
    const [isChannelJoinOpen, setChannelJoinOpen] = useState(false);
    const [isCreateChannelOpen, setCreateChannelOpen] = useState(false); 


    const openChat = () => {
        setChatOpen(true);
        if (isFriendListOpen) {
            setFriendListOpen(false);
        }
        if (isChannelJoinOpen) {
            setChannelJoinOpen(false);
        }
        setChatMembersOpen(false);
        setCreateChannelOpen(false);
    }
    const closeChat = () => {
        setChatOpen(false);
        setChatMembersOpen(false);
        setChannelJoinOpen(false);
        setCreateChannelOpen(false);
    }

    const toggleChatVisibility = () => {
        setChatOpen(!isChatOpen);
        setFriendListOpen(false);
        setChannelJoinOpen(false);
        setCreateChannelOpen(false);
    }

    const toggleFriendListVisibility = () => {
        setFriendListOpen(!isFriendListOpen);
        setChatOpen(false);
        setChatMembersOpen(false);
        setChannelJoinOpen(false);
        setCreateChannelOpen(false);
    }

    const toggleChannelJoinVisibility = () => {
        setChannelJoinOpen(!isChannelJoinOpen);
        setChatOpen(false);
        setChatMembersOpen(false);
        setFriendListOpen(false);
        setCreateChannelOpen(false);
    }

    const toggleChatMembersVisibility = () => {
        setChatMembersOpen(!isChatMembersOpen);
    }

    const toggleCreateChannelVisibility = () => {
        setCreateChannelOpen(!isCreateChannelOpen);
        setChatOpen(false);
        setChatMembersOpen(false);
        setFriendListOpen(false);
        setChannelJoinOpen(false);
    }

    return (
        <ChatBarContext.Provider value = {
            { isChatOpen, openChat, closeChat, toggleChatVisibility, isFriendListOpen, toggleFriendListVisibility, isChatMembersOpen, toggleChatMembersVisibility,
                isChannelJoinOpen, toggleChannelJoinVisibility, isCreateChannelOpen, toggleCreateChannelVisibility }
        }>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);