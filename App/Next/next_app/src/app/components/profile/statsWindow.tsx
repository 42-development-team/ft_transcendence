"use client";
import { useEffect, useState } from "react";
import Avatar from "../../components/profile/Avatar";
import Stats from "./Stats";

const StatsWindow = (userId: {userId: string}) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);



    useEffect(() => {
        const getAvatar = async () => {
            const response = await fetch(`${process.env.BACK_URL}/avatars/${userId.userId}`, {
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
        getAvatar();
    }, []);
    
    const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
        setAvatarFile(childAvatarFile);
        setImageUrl(childImageUrl);
    }

    return (
            <div className="flex flex-col md:flex-row mb-5 md:pl-[2vw]">
                        <Avatar
                            disableChooseAvatar={true} imageUrlGetFromCloudinary={imageUrl} CallbackAvatarData={handleCallBackDataFromAvatar} >
                        </Avatar>
                <div className="w-full font-semibold text-gray-400 text-center transition hover:duration-[550ms] rounded-lg bg-surface0 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.7)]">
                        <Stats userId={userId.userId}/>
                </div>
            </div>
    )
}

export default StatsWindow;