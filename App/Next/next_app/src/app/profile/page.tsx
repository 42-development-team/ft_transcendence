import ChatBar from "@/components/chat/ChatBar";

export default function Profile() {
    return (
        <div className="flex flex-auto w-full h-full">
            <ChatBar />
            <div className="w-full p-4 h-full">
                <a className="align-baseline"> Welcome to the profile page! </a>
            </div>
        </div>
    )
 }