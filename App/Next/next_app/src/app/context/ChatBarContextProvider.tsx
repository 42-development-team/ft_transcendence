"use client";
import {useContext, createContext, useState } from "react";

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

    const updateChatBarState = (state: ChatBarState) => {
        if (state == chatBarState) {
            setChatBarState(ChatBarState.Closed);
        } else {
            setChatBarState(state);
        }
        if (state != ChatBarState.ChatOpen) {
            setOpenChannelId("");
        }
    }

    const openChannel = (channelId: string) => {
        if (channelId == openChannelId) {
            setChatBarState(ChatBarState.Closed);
            setOpenChannelId("");
            return;
        }
        setChatBarState(ChatBarState.ChatOpen);
        setOpenChannelId(channelId);
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