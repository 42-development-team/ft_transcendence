"use client";

import { useState, ChangeEvent, useEffect } from "react";
import Image from 'next/image';
import fileType, { fileTypeFromBuffer } from 'file-type';
import { useEffectTimer } from "../auth/utils/useEffectTimer";

const Avatar = (
    {
        children,
        CallbackAvatarData = (AvFile: File | null, image: string, message: string | null) => {},
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
    const [message, setMessage] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffectTimer(true, 2600, setIsVisible);

    //check jpg
    function checkIfJpg(arrayBuffer: ArrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const jpgMagicNumber = [0xFF, 0xD8, 0xFF];

        for (let i = 0; i < jpgMagicNumber.length; i++) {
            if (bytes[i] !== jpgMagicNumber[i]) {
                console.log("File is not a JPG image");
                return (false);
            }
            return (true);
        }

    }
        /* When the user selects an image for the avatar, 
    the handleAvatarChange function is called */

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        
        if (!file) {
          // If no file is selected, reset the state for avatarFile and imageUrl
          setImageUrl(null);
          CallbackAvatarData(null, null, null);
          return;
        }
      
        if (file) {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                if (checkIfJpg(arrayBuffer) == false) {
                    setMessage("File is not a JPG image");
                    setIsVisible(true);
                    CallbackAvatarData(null, null, "File is not a JPG image");
                    console.log("File is not a JPG image");
                    return;
                }
            };
            reader.readAsArrayBuffer(file);
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
        const objectURL = URL.createObjectURL(file);
        setImageUrl(objectURL);
        CallbackAvatarData(file, objectURL, null); //Send Avatar DAta to Parent Component
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