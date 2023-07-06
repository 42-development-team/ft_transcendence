import ChatBar from "@/components/chat/ChatBar";

export default function Home() {
    return (
        <div className="flex flex-row flex-auto items-center justify-center py-2">
            <ChatBar />
            <div>
                <a className="align-baseline"> You should land here after successful login </a>
            </div>
        </div>
    )
 }