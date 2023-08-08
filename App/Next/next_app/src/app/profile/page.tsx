import ChatBar from "@/components/chat/ChatBar";
import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";

export default async function Profile() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }

    return ( //create a component for leader/matchhistory
        <div className=" flex flex-row w-full h-full">
            <ChatBar />
            <div className=" flex flex-col w-full h-full mx-5">
                <div className="z-10 relative">
                    <StatsWindow userId={payload.sub} />
                </div>
                <div className=" z-5 relative h-[70vh] mx-10 my-5 rounded-lg transition hover:duration-[550ms] bg-surface0  hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                    <UnderlineTabs />
                </div>
            </div>
        </div>
    )
 }