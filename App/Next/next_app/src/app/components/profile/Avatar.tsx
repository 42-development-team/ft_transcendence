"use client";

import { useState, ChangeEvent, useEffect, useContext } from "react";
import Image from 'next/image';
import ThemeContext from "../theme/themeContext";
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionLarge, DropDownActionRed } from "../dropdown/DropDownItem";

const Avatar = (
    {
        children,
        CallbackAvatarData = (AvFile: File | null, image: string, message: string | null) => { },
        isOnProfilePage = false,
        imageUrlGetFromCloudinary = null,
        disableChooseAvatar = false,
        disableImageResize = false,
        userName = null,
        currId = null,
        id = null,
        width = 212,
        height = 212,
    }
        :
        {
            children?: any;
            CallbackAvatarData?: any;
            isOnProfilePage?: boolean;
            imageUrlGetFromCloudinary?: string | null;
            disableChooseAvatar?: boolean;
            disableImageResize?: boolean;
            userName?: string | null;
            currId?: string | null;
            id?: string | null;
            width?: number;
            height?: number;
        }
) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [wrongFormat, setWrongFormat] = useState<boolean>(false);
    const { theme } = useContext(ThemeContext);
    const [textUsername, setTextUsername] = useState<string>(theme === "latte" ? "text-base" : "text-text");

    useEffect(() => {
        if (wrongFormat) {
            setWrongFormat(false);
            setImageUrl(null);
            imageUrlGetFromCloudinary = null;
        }
    }, [wrongFormat]);

    useEffect(() => {

    }, [imageUrl]);

    useEffect(() => {
        if (theme === "latte") {
            setTextUsername("text-surface0");
        }
        else {
            setTextUsername("text-text");
        }
        if (isOnProfilePage) {
        }
    }, [theme]);

    //check jpg / png
    function checkFormat(arrayBuffer: ArrayBuffer) {
        const bytes = new Uint8Array(arrayBuffer);
        const jpgMagicNumber = [0xFF, 0xD8, 0xFF];
        const pngMagicNumber = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A];
        let isValid = true;

        for (let i = 0; i < jpgMagicNumber.length; i++) {
            if (bytes[i] !== jpgMagicNumber[i]) {
                isValid = false;
            }
        }
        if (isValid) { return true; };
        isValid = true;
        for (let i = 0; i < pngMagicNumber.length; i++) {
            if (bytes[i] !== pngMagicNumber[i]) {
                isValid = false;
            }
        }
        return isValid;

    }

    const isImage = (event: ProgressEvent<FileReader>) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (checkFormat(arrayBuffer) == false) {
            setWrongFormat(true);
            CallbackAvatarData(null, null, "File is not a JPG/PNG image");
            return;
        }
        else {
            setWrongFormat(false);
        }
    };

    /* When the user selects an image for the avatar, 
    the handleAvatarChange function is called */
    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        setWrongFormat(true);
        const file = e.target.files?.[0] || null;

        if (!file) {
            // If no file is selected, reset the state for avatarFile and imageUrl
            setImageUrl(null);
            CallbackAvatarData(null, null, null);
            return;
        }

        if (file) {
            const reader = new FileReader();
            reader.onload = isImage;
            reader.readAsArrayBuffer(file);
        }

        if (wrongFormat) {
            setImageUrl(null);
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
        CallbackAvatarData(file, objectURL, null); //Send Avatar DAta to Parent Component
    };

    /* factice onClick just for testing DropDown, TODO: remove and create some file and real function */
    const onAddClick = () => {  };
    /* */

    return (
        <div className="flex flex-col my-5 justify-center ">
            <div className={` flex fex-row items-center justify-center font-bold text-center text-2xl mb-2 ` + textUsername}>
                <div>{userName}</div>
                {
                    isOnProfilePage && currId !== id &&
                    <div className="ml-2">
                        <DropDownMenu>
                            <DropDownActionLarge onClick={onAddClick}>ADD/DELETE</DropDownActionLarge> {/*ADD or DELETE friend */}
                            <DropDownActionLarge onClick={onAddClick}>PLAY</DropDownActionLarge>
                            <DropDownActionRed onClick={onAddClick}>BLOCK</DropDownActionRed>
                        </DropDownMenu>
                    </div>
                }

            </div>
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