import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import Chat from "@/components/chat/Chat";

export default async function Profile() {

    const payload = await getJwt();
    if (payload === null || payload === undefined || payload.sub === undefined) {
        const router = useRouter();
        router.push('/');
        return;
    }

    return ( //create a component for leader/matchhistory + fix z-index of Stats vs DropDownMenu
        <div className=" flex w-full h-full"> 
            <Chat userId={payload.sub}/>
            <div className="flex flex-col mx-5 w-full h-full">
                <div className="flex w-full">
                    <StatsWindow userId={payload.sub} />
                </div>
                <div className="w-[80vh] h-[70vh] my-5 rounded-lg transition hover:duration-[550ms] bg-surface0 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                    <UnderlineTabs />
                </div>
            </div>
        </div>
    )
}