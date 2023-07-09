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
        // <form className="mt-6 flex flex-row flex-auto justify-between items-center">
        <form className={className} onSubmit={handleSubmit}>
            <input
                type="text"
                onChange={(e) => {
                    setMessage(e.target.value);
                }}
                value={message}
                className=" w-[42vh] p-2 rounded bg-crust text-sm focus:outline-none focus:ring-1 focus:ring-mauve"
                placeholder="Send a chat message"
            />
            <button
                className="button-mauve"
                // className=" bg-mauve float-right p-2 rounded-md text-base text-sm font-bold"
                type="submit">
                    Chat
            </button>
        </form>
    )
}

export default SendMessageForm;