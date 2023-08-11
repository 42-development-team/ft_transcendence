"use client";
import React, {useContext, createContext, useState, useEffect} from "react";

export enum ChatBarState {
    Closed,
    ChatOpen,
    FriendListOpen,
    ChatMembersOpen,
    JoinChannelOpen,
    CreateChannelOpen,
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
        console.log("open channel id: " + openChannelId);
    }, [openChannelId]);

    const updateChatBarState = (state: ChatBarState) => {
        if (state == chatBarState) {
            setChatBarState(ChatBarState.Closed);
        } else {
            setChatBarState(state);
        }
    }

    const openChannel = (channelId: string) => {
        if (channelId == openChannelId) {
            setChatBarState(ChatBarState.Closed);
            setOpenChannelId("");
            return;
        }
        setOpenChannelId(channelId);
        setChatBarState(ChatBarState.ChatOpen);
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