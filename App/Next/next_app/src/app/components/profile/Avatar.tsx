"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image';
import imageType from 'image-type';

const Avatar = (
    {
        children,
        CallbackAvatarData = (AvFile: File | null, image: string) => {},
        imageUrlGetFromCloudinary = null,
        disableChooseAvatar = false,
        disableImageResize = false,
        userName = null,
        userId = null,
        width = 212,
        height = 212,
    }
    :
    {
        children?: any;
        CallbackAvatarData?: any;
        imageUrlGetFromCloudinary?: string | null;
        disableChooseAvatar?: boolean;
        disableImageResize?: boolean;
        userName?: string | null;
        userId?: string | null;
        width?: number;
        height?: number;
    }
) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

        /* When the user selects an image for the avatar, 
    the handleAvatarChange function is called */
    const reader = new FileReader();
    reader.onloadend = async function (event) {
        const buffer = new Uint8Array(reader.result as ArrayBuffer);
        const type =  await imageType(buffer);

        if (!type || !type.mime.startsWith('image/')) {
            console.log('Selected file is not an image.');
            return;
        }

        // The rest of your code...
    };
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
        reader.readAsArrayBuffer(file);
)
      
        const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSizeInBytes) {
          console.log('Setlected file size exceeds the allowed limit.');
          return;
        }
        const objectURL = URL.createObjectURL(file);
        setImageUrl(objectURL);
        CallbackAvatarData(file, objectURL); //Send Avatar DAta to Parent Component
      };

    return (
        <div className="flex flex-col my-5 justify-center ">
            <p className=" font-bold text-center text-2xl mb-1">{userName}</p>
            <div className={`${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"}`}>
                {imageUrl || (imageUrlGetFromCloudinary && imageUrlGetFromCloudinary != 'noavatar.jpg') ? (
                    <div className="flex justify-center">
                        {/* Display uploaded avatar image temporary stored in URL*/}
                        <Image
                            src={imageUrlGetFromCloudinary as string || imageUrl as string}
                            alt="Selected Avatar"
                            width={width}
                            height={height}
                            className={` ${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"}   drop-shadow-xl rounded-full`}
                        />
                    </div>
                ) : (
                    <div className="flex justify-center">
                        {/* Display default avatar */}
                        <Image
                            src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                            alt="Default Avatar"
                            width={width}
                            height={height}
                            className={`${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"} drop-shadow-xl rounded-full`}
                        />
                    </div>
                )}
                {!disableChooseAvatar &&
                    <div className="mt-8 text-center">
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
        </div>
    )

}

export default Avatar;