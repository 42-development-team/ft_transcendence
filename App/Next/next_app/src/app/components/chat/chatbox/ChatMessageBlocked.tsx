import { MessageModel } from "@/app/utils/models";
import { useState } from "react";
import ChatMessage from "./ChatMessage";

type MessageProps = {
    message: MessageModel,
    color: string
}

const ChatMessageBlocked = ({message, color}: MessageProps) => {
    const [showMessage, setShowMessage] = useState<boolean>(false);

    if (showMessage) {
        return (
            <div className="flex justify-between items-center mr-2">
                <ChatMessage message={message} color={color} />
                <button className="rounded bg-surface0 py-1 px-2 text-sm h-fit"
                    onClick={() => setShowMessage(!showMessage)}>x</button>
            </div>
        )
    }
    return (
        <div className={"flex justify-between text-sm py-1 px-2 rounded hover:bg-surface1 leading-6 mb-1 mr-2"}>
            <span className="ml-3 break-words">Blocked message</span>
            <button className="rounded bg-surface0 p-1"
                onClick={() => setShowMessage(!showMessage)}>Show message</button>
        </div>
    )
}

export default ChatMessageBlocked;