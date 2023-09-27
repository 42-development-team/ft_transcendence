'use client';

import { useContext, useEffect, useState } from "react";
import Avatar from "./Avatar";
import ThemeContext from "../theme/themeContext";



const leaderBoard = ( props: { data: any, currentUser: number } ) => {
    const data = Array.isArray(props.data) ? props.data : [];
    const currentUserId = props.currentUser;
    const [ openAlert, setOpenAlert ] = useState(false);
    const {theme} = useContext(ThemeContext);
    const [elementsColor, setElementsColor] = useState<string>(theme === "latte" ? "from-red" : "from-peach");
    const [textColor, setTextColor] = useState<string>(theme === "latte" ? "text-red" : "text-peach");

    const onProfileClick = (userId: number) => {
        sessionStorage.setItem("userId", userId.toString());
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }

    useEffect(() => {
        if (theme === "latte") {
            setElementsColor("from-red");
            setTextColor("text-red");
        }
        else {
            setElementsColor("from-peach");
            setTextColor("text-peach");
        }
    }, [theme]);

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            { data !== undefined && data !== null && data.length !== 0 ? (
            <div className="flex flex-col">
                {data.map((item: any, index: number) => (
                    <div key={index} className={`${item.userId === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r ' + elementsColor + ' to-surface1'
                        : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}`}>
                        <span className="flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                            <div className="flex flex-row justify-center sm:pr-0 pr-2">
                                <div className="flex flex-col justify-center">
                                    <div className="pr-[3vw] text-sky">
                                        {index + 1}
                                    </div>
                                </div>
                                <Avatar
                                    width={64} height={64} imageUrlGetFromCloudinary={item.avatar} disableChooseAvatar={true} userName={item.username} currId={item.userId} isOnProfilePage={false}
                                />
                            </div>
                            <button className={item.userId === currentUserId ? `flex flex-col justify-center text-[1.5rem] md:text-[1.7rem] ` + textColor
                                                                                : 'flex flex-col justify-center hover:scale-110 hover:text-teal text-[1.4rem] md:text-[1.6rem]'} 
                                    onClick={() => onProfileClick(item.userId)}
                            >
                                {item.userName}
                            </button>
                            <div className="flex flex-col justify-center pr-[4vw]">
                                <div className="flex mb-2 justify-center text-center">Total Score</div>
                                <div className={`flex justify-center text-[1.4rem] md:text-[1.6rem] `+ textColor} style={{color : item.userId === currentUserId ? "peach" : "grey"}}>{item.totalScore} </div>
                            </div>
                        </span>
                    </div>
            ))}
            </div>
            ) : (
                <div className="flex flex-col h-full justify-center">
                        <span className="flex justify-center text-[5rem] text-gray-700 leading-[5rem]">
                            No Leaderboard available
                        </span>
                </div>
            )}
        </div>
    )
}
export default leaderBoard;