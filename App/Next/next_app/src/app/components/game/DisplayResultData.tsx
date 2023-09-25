"use client";

import { useEffect, useState } from "react";
import Avatar from "../profile/Avatar";

export function DisplayResultData({ user, opponent }: { user: any, opponent: any }) {
    return (
        <div className="flex flex-row justify-between bg-base rounded-lg bg-opacity-80 backdrop-blur-sm">
        <div className="flex">
            {user ? (
                <div className="flex flex-col text-center ml-[4vw] ">
                    <Avatar
                        width={64} height={64} imageUrlGetFromCloudinary={user.avatar} disableChooseAvatar={true} disableImageResize={true} currId={user.id} isOnProfilePage={false}
                    />
                    {user.userName}
                </div>
            ) : (
                <div className="flex w-16 h-16 bg-crust rounded-full animate-pulse">Loading..</div>
            )
            }
        </div>
        <div className="flex flex-row items-center">
            {user ? user.score : "Loading..."} - {opponent ? opponent.score : "Loading.."}
        </div>
        <div className="flex flex-row">
            {opponent ? (
                <div className="flex flex-col text-center mr-[4vw]">
                    <Avatar
                        width={64} height={64} imageUrlGetFromCloudinary={opponent.avatar} disableChooseAvatar={true} disableImageResize={true} currId={opponent.id} isOnProfilePage={false}
                    />
                    {opponent.userName}
                </div>
            ) : (
                <div className="flex w-16 h-16 bg-crust rounded-full animate-pulse">Loading..</div>
            )
            }
        </div>
    </div>
    )
}