'use client';

import { useState } from "react";
import Avatar from "./Avatar";

const leaderBoard = ( props: { data: any, currentUser: number } ) => {
    const data = props.data;
    const currentUserId = props.currentUser;
    const [ openAlert, setOpenAlert ] = useState(false);
    
    const onProfileClick = (userId: number) => {
        sessionStorage.setItem("userId", userId.toString());
        console.log("sessionuserID", sessionStorage.getItem("userId"));
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }
    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
            {data.map((item: any, index: number) => (
                <div key={index} className={item.userId === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-sapphire to-base' 
                    : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                    <span className="flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                        <Avatar 
                            imageUrlGetFromCloudinary={item.avatarUrl} disableChooseAvatar={true} disableImageResize={true} userName={item.username} userId={item.userId} 
                        />
                        <div className="flex flex-col justify-center">
                            {item.username}
                        </div>
                        <div className="flex flex-col justify-center">
							<div>W/D/R(%)</div>
                            <div>{item.totalScore}</div>
                        </div>
                    </span>
                </div>
            ))}
            </div>
        </div>
    )
}
export default leaderBoard;