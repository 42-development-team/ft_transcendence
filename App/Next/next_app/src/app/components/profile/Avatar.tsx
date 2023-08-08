"use client";

import { useState, ChangeEvent } from "react";
import Image from 'next/image';

const AvatarComponent = (
    {
        children,
        CallbackAvatarFile = () => {},
        CallbackImageUrl = () => {},
    }
    :
    {
        children: any;
        CallbackAvatarFile: any;
        CallbackImageUrl: any;
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
          CallbackAvatarFile(null);
          CallbackImageUrl(null);
          return;
        }
      
        if (!file.type.startsWith('image/')) {
          console.log('Selected file is not an image.');
          return;
        }
      
        const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
        if (file.size > maxFileSizeInBytes) {
          console.log('Selected file size exceeds the allowed limit.');
          return;
        }
      
        CallbackAvatarFile(file); //Send Avatar file to Parent Component
        CallbackImageUrl(URL.createObjectURL(file)); //Send Image URL to Parent Component
      };

    return (
        <div className="m-4 pt-4">
            <p className="font-bold text-center"></p>
            {imageUrl ? (
                <div>
                    {/* Display uploaded avatar image temporary stored in URL*/}
                    <Image
                        src={imageUrl}
                        alt="Selected Avatar"
                        width={128}
                        height={128}
                        className="drop-shadow-xl"
                    />
                </div>
            ) : (
                <div>
                    {/* Display default avatar */}
                    <Image
                        src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                        alt="Default Avatar"
                        width={128}
                        height={128}
                        className="drop-shadow-xl"
                    />
                </div>
            )}
            <div className="mt-2" style={{ marginTop: "20px" }}>
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
        </div>
    )

}

export default AvatarComponent;