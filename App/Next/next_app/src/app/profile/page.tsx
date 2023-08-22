
import StatsWindow from "../components/profile/statsWindow";
import { UnderlineTabs } from "../components/profile/tabs";
import getJwt from '@/app/utils/getJwt';
import { useRouter } from "next/navigation";
import Chat from "@/components/chat/Chat";
import sessionStorageUser from "../components/profile/sessionStorage";

export default async function Profile() {

    const payload = await getJwt();
    let userId = "";
    if (payload !== null && payload !== undefined) {
        userId = payload.sub as string;
    }
    else {
        const router = useRouter();
        router.push('/');
        return;
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