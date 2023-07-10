import { useState } from "react"

type SendMessageFormProps = {
    onSend: (message: string) => void
    className?: string
}

const MAX_MESSAGE_LENGTH = 300

const SendMessageForm = ({ onSend, className }: SendMessageFormProps) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const filteredMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH);
        if (filteredMessage) {
            onSend(filteredMessage);
        }
        setMessage('')
    }
    
    return (
        <form className={className} onSubmit={handleSubmit}>
            <input
                type="text" value={message}
                className=" w-[42vh] p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve"
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
                placeholder="Send a chat message" />
            <button
                className="button-mauve" type="submit">
                    Chat
            </button>
        </form>
    )
}

export default SendMessageForm;