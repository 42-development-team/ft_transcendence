"use client";
import React, {useContext, createContext, useState} from "react";

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
    setChatBarState: (state: ChatBarState) => void;
}

const ChatBarContextDefaultValues: ChatBarContextType = {
    chatBarState: ChatBarState.Closed,
    setChatBarState: () => {},
}

const ChatBarContext = createContext<ChatBarContextType>(ChatBarContextDefaultValues);

export const ChatBarContextProvider = ({children} : {children: React.ReactNode}) => {
    const [chatBarState, setChatBarState] = useState(ChatBarState.Closed);

    return (
        <ChatBarContext.Provider value = {
            { chatBarState, setChatBarState }
        }>
            {children}
        </ChatBarContext.Provider>
    )
}

export const useChatBarContext = () => useContext(ChatBarContext);