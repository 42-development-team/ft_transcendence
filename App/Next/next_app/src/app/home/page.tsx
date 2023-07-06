import ChatBar from "@/components/chat/ChatBar";

export default function Home() {
    return (
        <div className="flex flex-auto w-full">
            <ChatBar />
            <div className="w-full p-4">
                <a > You should land here after successful login </a>
            </div>
        </div>
    )
 }