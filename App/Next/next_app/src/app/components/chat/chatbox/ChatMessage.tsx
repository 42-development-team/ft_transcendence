import { MessageModel } from "@/app/utils/models";


type MessageProps = {
    message: MessageModel
}

const ChatMessage = ({message: {senderUsername, content}}: MessageProps) => {
    const color = 'darkorchid';
    const Author = (
        <span className="font-semibold" style={{color: color }}>
            {senderUsername}
        </span>
    )

    return (
        <div className={" text-sm py-1 px-2 rounded hover:bg-surface1 leading-6 mb-1 mr-2"}>
            <div className="inline-flex items-baseline">
                {Author}
            </div>
            <span className="ml-3 break-words">{content}</span> 
        </div>
    )
}

export default ChatMessage;