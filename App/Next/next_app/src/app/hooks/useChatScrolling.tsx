import { useEffect, useRef } from "react";
import { MessageModel } from "../utils/models";

export default function useChatScrolling<T extends HTMLElement>(
    messages: MessageModel[]
) {
    const chatMessageBoxRef = useRef<T | null>(null);

    const scrollNewMessages = () => {
        chatMessageBoxRef.current?.lastElementChild?.scrollIntoView(
            { behavior: "smooth" }
        )
    }

    useEffect(() => {
        console.log("useChatScrolling: useEffect: messages changed");
        scrollNewMessages();
    }, [messages, scrollNewMessages])

    return {
        chatMessageBoxRef
    }
}