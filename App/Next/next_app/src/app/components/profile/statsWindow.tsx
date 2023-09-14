"use client";
import { useEffect, useState } from "react";
import Avatar from "../../components/profile/Avatar";
import Stats from "./Stats";
import sessionStorageUser from "./sessionStorage";
import { useAuthContext } from "@/app/context/AuthContext";
import getAvatarById from "../utils/getAvatarById";

const StatsWindow = ({ userId }: { userId: string }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [statsData, setStatsData] = useState<any>("null");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [statsLoaded, setStatsLoaded] = useState<boolean>(false);
    const [avatarLoaded, setAvatarLoaded] = useState<boolean>(false);
    const { login } = useAuthContext();

    useEffect(() => {
        login();
    }, []);

    useEffect(() => {
        let sessionUserId = null;
        sessionUserId = sessionStorageUser();

        if (sessionUserId !== null && sessionUserId !== undefined) {
            userId = sessionUserId as string;
        }


        const getAvatar = async () => {
            setImageUrl(await getAvatarById(userId));
            setAvatarLoaded(true);
        }

        const getStats = async () => {
            const response = await fetch(`${process.env.BACK_URL}/userstats/info/${userId}`, {
                credentials: "include",
                method: "GET",
            });
            const data = await response.json();
            setStatsData(await data);
            setStatsLoaded(true);
        }

        try {
            getAvatar();
            getStats();
        } catch (error) {
            console.log("Error response when fetching userstats/info:", error);
        }
    }, [statsLoaded, avatarLoaded]);

    const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
        setAvatarFile(childAvatarFile);
        setImageUrl(childImageUrl);
    }

    return (
        <div className="flex flex-col sm:flex-row mb-5 ">
            <Avatar
                disableChooseAvatar={true}
                imageUrlGetFromCloudinary={imageUrl}
                CallbackAvatarData={handleCallBackDataFromAvatar}
                userName={statsData.userName}
                id={statsData.userId}
                currId={userId}
                isOnProfilePage={true}
            >
            </Avatar>
            <div className=" w-full sm:ml-[2vw] font-semibold text-gray-400 text-center hover:duration-[550ms] rounded-lg
                bg-surface0 bg-opacity-90 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.15)]">
                <Stats userId={userId} stats={statsData} />
            </div>
        </div>
    )
}

export default StatsWindow;