"use client";
import ChatBar from "@/components/chat/ChatBar";
import { UnderlineTabs } from "../components/profile/tabs";

export default function Profile() {
    return (
        <div className=" flex flex-row w-full h-full">
            <ChatBar />
            <div className="flex flex-col w-full h-full mx-5">
                <div className=" mx-20 font-semibold text-gray-400 text-center h-[20vh] mt-5 transition hover:duration-[550ms] rounded-lg bg-surface0 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                    Stats <br /><br /><br /> Here Stats Component(s) will be rendered
                </div>
                <div className=" h-[70vh] mx-10 my-5 rounded-lg transition hover:duration-[550ms] bg-surface0  hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                    <UnderlineTabs />
                </div>
                </div>
        </div>
    )
 }