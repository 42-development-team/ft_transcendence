'use client';

import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { useRouter } from "next/navigation";



const leaderBoard = ( props: { data: any, currentUser: number } ) => {
    const data = Array.isArray(props.data) ? props.data : [];
    const currentUserId = props.currentUser;
    const Router = useRouter();
    const [ openAlert, setOpenAlert ] = useState(false);
    
    const onProfileClick = (userId: number) => {
        sessionStorage.setItem("userId", userId.toString());
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            Router.push("/profile");
    }

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
                {data.map((item: any, index: number) => (
                    <div key={index} className={item.userId === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-sapphire to-base'
                        : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                        <span className="flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                            <div className="flex flex-row justify-center">
                                <div className="flex flex-col justify-center">
                                    <div className="pr-[3vw] text-sky">
                                        {index + 1}
                                    </div>
                                </div>
                                <Avatar
                                    width={64} height={64} imageUrlGetFromCloudinary={item.avatar} disableChooseAvatar={true} disableImageResize={true} userName={item.username} userId={item.userId}
                                />
                            </div>
                            <button className={item.userId === currentUserId ? `flex flex-col justify-center text-[1.5rem] md:text-[1.7rem] text-sapphire` : 'flex flex-col justify-center hover:scale-110 hover:text-teal text-[1.4rem] md:text-[1.6rem]'} 
                                    onClick={() => onProfileClick(item.userId)}
                            >
                                {item.userName}
                            </button>
                            <div className="flex flex-col justify-center pr-[4vw]">
                                <div className="flex mb-2 justify-center">Total Score</div>
                                <div className="flex justify-center text-[1.4rem] md:text-[1.6rem] text-sapphire">{item.totalScore}</div>
                            </div>
                        </span>
                    </div>
            ))}
            </div>
        </div>
    )
}
export default leaderBoard;