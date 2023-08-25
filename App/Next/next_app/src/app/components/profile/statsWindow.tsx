"use client";
import { useEffect, useState } from "react";
import Avatar from "../../components/profile/Avatar";
import Stats from "./Stats";
import sessionStorageUser from "./sessionStorage";

const StatsWindow = ({userId}: {userId: string} ) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [statsData, setStatsData] = useState<any>("null");
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);


    useEffect(() => {
        let sessionUserId = null;
        sessionUserId = sessionStorageUser();

        if (sessionUserId !== null && sessionUserId !== undefined) {
            userId = sessionUserId as string;
        }

        const getAvatar = async () => {
            const response = await fetch(`${process.env.BACK_URL}/avatars/${userId}`, {
                credentials: "include",
                method: "GET",
            });
            if (!response.ok) {
                console.log("Error response status:", response.status);
                console.log("Error response text:", response.text());
                return (response.status);
            }
            const data = await response.json();
            setImageUrl(data.avatar);
            return (data.avatar);
        }

        const getStats = async () => {
            const response = await fetch(`${process.env.BACK_URL}/userstats/info/${userId}`, {
                credentials: "include",
                method: "GET",
            });
            if (!response.ok) {
                console.log("Error response status when fetching userstats/info:", response.status);
                console.log("Error response text when fetching userstats/info:", response.text());
                return (response.status);
            }
            const data = await response.json();
            setStatsData(data);
            setIsLoaded(true);
        }

        getAvatar();
        getStats();
    }, []);
    
    const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
        setAvatarFile(childAvatarFile);
        setImageUrl(childImageUrl);
    }

    return (
        <div className="flex flex-col sm:flex-row mb-5 ">
            <Avatar
                disableChooseAvatar={true} imageUrlGetFromCloudinary={imageUrl} CallbackAvatarData={handleCallBackDataFromAvatar} userName={statsData.userName} userId={userId}>
            </Avatar>
            <div className="w-full sm:ml-[2vw] font-semibold text-gray-400 text-center transition hover:duration-[550ms] rounded-lg
                bg-surface0 bg-opacity-70 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                <Stats userId={userId} stats={statsData}/>
            </div>
        </div>
    )
}

export default StatsWindow;