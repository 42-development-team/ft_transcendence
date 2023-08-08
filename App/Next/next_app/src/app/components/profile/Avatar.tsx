"use client";



import { useState, ChangeEvent } from "react";
import Image from 'next/image';

const Avatar = (
    {
        children,
        CallbackAvatarData = (AvFile: File | null, image: string) => {},
        imageUrlGetFromCloudinary = null,
        disableChooseAvatar = false,
    }
    :
    {
        children: any;
        CallbackAvatarData: any;
        imageUrlGetFromCloudinary: string | null;
        disableChooseAvatar: boolean;
    }
) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

        /* When the user selects an image for the avatar, 
    the handleAvatarChange function is called */
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
      
        if (!file) {
          // If no file is selected, reset the state for avatarFile and imageUrl
          setImageUrl(null);
          CallbackAvatarData(null, null);
          return;
        }
      
        if (!file.type.startsWith('image/')) {
          console.log('Selected file is not an image.');
          return;
        }
      
        const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSizeInBytes) {
          console.log('Setlected file size exceeds the allowed limit.');
          return;
        }
      
        setImageUrl(URL.createObjectURL(file));
        CallbackAvatarData(file, imageUrl); //Send Avatar DAta to Parent Component
      };

    return (
        <div className="m-4">
            <p className="font-bold text-center ">Username</p>
            {imageUrl || imageUrlGetFromCloudinary? (
                <div>
                    {/* Display uploaded avatar image temporary stored in URL*/}
                    <Image
                        src={imageUrlGetFromCloudinary as string || imageUrl as string}
                        alt="Selected Avatar"
                        width={188}
                        height={188}
                        className="sm:transition-all md:transition-all lg:transition-all 2xl:transition-all duration-900 drop-shadow-xl rounded-full sm:w-[200px] sm:h-[200px] md:w-[212px] md:h-[212px] lg:w-[256px] lg:h-[256px] 2xl:w-[312px] 2xl:h-[312px]"
                    />
                </div>
            ) : (
                <div>
                    {/* Display default avatar */}
                    <Image
                        src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                        alt="Default Avatar"
                        width={256}
                        height={256}
                        className="sm:transition-all md:transition-all lg:transition-all 2xl:transition-all duration-900 drop-shadow-xl rounded-full sm:w-[200px] sm:h-[200px] md:w-[212px] md:h-[212px] lg:w-[256px] lg:h-[256px] 2xl:w-[312px] 2xl:h-[312px]"
                    />
                </div>
            )}
            { !disableChooseAvatar &&
            <div className="mt-8 mb-3 text-center">
                <label htmlFor="avatarInput" className="cursor-pointer" style={{ backgroundColor: "#FFFFFF", color: "#000000", padding: "10px", borderRadius: "5px", fontWeight: "bold" }}>
                    {imageUrl ? "Change Avatar" : "Choose Avatar"}
                </label>
                <input
                    type="file"
                    id="avatarInput"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                />
            </div>
            }
        </div>
    )

}

export default Avatar;