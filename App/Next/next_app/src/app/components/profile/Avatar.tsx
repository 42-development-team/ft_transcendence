"use client";



import { useState, ChangeEvent } from "react";
import Image from 'next/image';

const Avatar = (
    {
        children,
        CallbackAvatarData = (AvFile: File | null, image: string) => {},
        imageUrlGetFromCloudinary = null,
        disableChooseAvatar = false,
        disableImageResize = false,
    }
    :
    {
        children: any;
        CallbackAvatarData: any;
        imageUrlGetFromCloudinary: string | null;
        disableChooseAvatar: boolean;
        disableImageResize: boolean;
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
        const objectURL = URL.createObjectURL(file);
        setImageUrl(objectURL);
        CallbackAvatarData(file, objectURL); //Send Avatar DAta to Parent Component
      };

    return (
        <div className="flex flex-col my-5 justify-center ">
            <p className=" font-bold text-center mb-1">Username</p>
            <div className={`${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"}`}>
                {imageUrl || (imageUrlGetFromCloudinary && imageUrlGetFromCloudinary != 'noavatar.jpg') ? (
                    <div className="flex justify-center">
                        {/* Display uploaded avatar image temporary stored in URL*/}
                        <Image
                            src={imageUrlGetFromCloudinary as string || imageUrl as string}
                            alt="Selected Avatar"
                            width={212}
                            height={212}
                            className={` ${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"}   drop-shadow-xl rounded-full`}
                        />
                    </div>
                ) : (
                    <div>
                        {/* Display default avatar */}
                        <Image
                            src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                            alt="Default Avatar"
                            width={200}
                            height={200}
                            className={`${!disableImageResize && "sm:transition-all duration-900 sm:h-[222px] sm:w-[222px] md:transition-all md:h-[232px] md:w-[232px] lg:transition-all lg:h-[240px] lg:w-[240px] xl:transition-all xl:h-[250px] xl:w-[250px]"} drop-shadow-xl rounded-full`}
                        />
                    </div>
                )}
                {!disableChooseAvatar &&
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
        </div>
    )

}

export default Avatar;