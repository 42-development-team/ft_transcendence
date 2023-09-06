"use client";
import {useContext, createContext, useState, useEffect } from "react";

export enum ChatBarState {
    Closed,
    ChatOpen,
    FriendListOpen,
    ChatMembersOpen,
    JoinChannelOpen,
    CreateChannelOpen,
    ChannelSettingsOpen,
}

type ChatBarContextType = {
    chatBarState: ChatBarState;
    updateChatBarState: (state: ChatBarState) => void;
    openChannelId: string;
    openChannel: (channelId: string) => void;
}

const ChatBarContextDefaultValues: ChatBarContextType = {
    chatBarState: ChatBarState.Closed,
    updateChatBarState: () => {},
    openChannelId: "",
    openChannel: () => {},
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [chatBarState, setChatBarState] = useState(ChatBarState.Closed);
    const [openChannelId, setOpenChannelId] = useState<string>("");

    useEffect(() => {
        const chatBarStateValue = localStorage.getItem("chatBarState");
        if (chatBarStateValue) {
            setChatBarState(JSON.parse(chatBarStateValue));
        }
        const openChannelIdValue = localStorage.getItem("openChannelId");
        if (openChannelIdValue) {
            setOpenChannelId(openChannelIdValue);
        }
    }, []);

    const updateChatBarState = (state: ChatBarState) => {
        if (state == chatBarState) {
            state = ChatBarState.Closed;
        }
        setChatBarState(state);
        if (state != ChatBarState.ChatOpen && state != ChatBarState.ChatMembersOpen) {
            setOpenChannelId("");
            localStorage.setItem("openChannelId", "");
        }
        localStorage.setItem("chatBarState", JSON.stringify(state));
    }

    const openChannel = (channelId: string) => {
        if (channelId == openChannelId) {
            setChatBarState(ChatBarState.Closed);
            localStorage.setItem("chatBarState", JSON.stringify(ChatBarState.Closed));
            setOpenChannelId("");
            localStorage.setItem("openChannelId", "");
            return;
        }
        setChatBarState(ChatBarState.ChatOpen);
        localStorage.setItem("chatBarState", JSON.stringify(ChatBarState.ChatOpen));
        setOpenChannelId(channelId);
        localStorage.setItem("openChannelId", channelId);
    }

    return (
        <ChatBarContext.Provider value = {
            { chatBarState, updateChatBarState, openChannelId, openChannel }
        }>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);
