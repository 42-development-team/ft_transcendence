import { useCallback, useEffect, useRef, useState } from "react";
import { MessageModel } from "../utils/models";

export default function useChatLiveScrolling<T extends HTMLElement>(
    messages: MessageModel[]
) {
    const chatMessageBoxRef = useRef<T | null>(null);

    const scrollNewMessages = useCallback(() => {
        chatMessageBoxRef.current?.lastElementChild?.scrollIntoView()
    }, [])

    useEffect(() => {
            scrollNewMessages()
    }, [messages, scrollNewMessages])

    return {
        chatMessageBoxRef,
        scrollNewMessages,
    }
}