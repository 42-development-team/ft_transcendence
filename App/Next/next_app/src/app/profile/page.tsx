import ChatBar from "@/components/chat/ChatBar";

export default function Profile() {
    return (
        <div className=" flex flex-full w-full h-full">
            <ChatBar />
            <div className=" py-8 px-10 my-20 mx-12 w-full h-[85vh] grid sm:grid-cols-2 gap-x-36 gap-y-20 rounded">
                <div className=" transition hover:duration-[550ms] rounded-lg bg-surface0 flex hover:shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)]"></div>
                <div className="rounded-lg hover:duration-[550ms] hover:border-4 hover:border-surface1 bg-surface0 flex hover:shadow-[0_35px_90px_-10px_rgba(0,0,0,0.7)]"></div>
            </div>
        </div>
    )
 }