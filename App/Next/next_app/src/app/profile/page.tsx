import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/router";
import Chat from "@/components/chat/Chat";

export default async function Profile() {

    const router = useRouter();
    let userId: string;
    if (router.query.userId !== undefined) {
        userId = router.query.userId as string;
    }
    else {
        const payload = await getJwt();
        if (payload === null || payload === undefined || payload.sub === undefined) {
            const router = useRouter();
            router.push('/');
            return;
        }
        userId = payload.sub;
    }
    
    return ( //create a component for leader/matchhistory + fix z-index of Stats vs DropDownMenu
        <div className="flex h-full w-full"> 
            <Chat userId={userId}/>
            <div className="mx-[7vw] my-[4vw] flex flex-col flex-grow">
                    <StatsWindow userId={userId} />
                    <UnderlineTabs />
            </div>
        </div>
    )
}