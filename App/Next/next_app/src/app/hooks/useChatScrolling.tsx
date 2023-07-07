import { useCallback, useEffect, useRef, useState } from "react";
import { MessageModel } from "../utils/models";

export default function useChatLiveScrolling<T extends HTMLElement>(
    messages: MessageModel[]
) {
    const [isLiveModeEnabled, setIsLiveModeEnabled] = useState(true);
    const chatMessageBoxRef = useRef<T | null>(null);

    const scrollNewMessages = useCallback(() => {
        chatMessageBoxRef.current?.lastElementChild?.scrollIntoView()
    }, [])

    useEffect(() => {
        if (isLiveModeEnabled) {
            scrollNewMessages()
        }
    }, [messages, isLiveModeEnabled, scrollNewMessages])

    return {
        chatMessageBoxRef,
        isLiveModeEnabled,
        scrollNewMessages,
    }
}