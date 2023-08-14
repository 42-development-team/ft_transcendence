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
        <div className="flex flex-row w-full h-full"> 
            <Chat userId={payload.sub}/>
            <div className="flex flex-col mx-5">
                <div className="flex flex-between">
                    <StatsWindow userId={payload.sub} />
                </div>
                <div className="h-[70vh] 2xl:mx-[125px] xl:mx-20 lg:mx-16 md:mx-14 sm:mx-8 my-5 rounded-lg transition hover:duration-[550ms] bg-surface0  hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                    <UnderlineTabs />
                </div>
            </div>
        </div>
    )
}