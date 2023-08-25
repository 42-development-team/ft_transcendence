'use client';

import { useState } from "react";

const matchHistory = ( props: { data: any, currentUserId: number } ) => {
    const data = props.data;
    const currentUserId = props.currentUserId;
    const [ openAlert, setOpenAlert ] = useState(false);

    const onProfileClick = (userId: number) => {
        sessionStorage.setItem("userId", userId.toString());
        console.log("sessionuserID", sessionStorage.getItem("userId"));
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }
    console.log("data: ", data);

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            <div className="flex flex-col">
                {data.map((item: any, index: number) => (
                    <div key={index} className={item.winner.id === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-peach to-base'
                        : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                        <span className=" flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 px-2">
                            <div className={`flex flex-col justify-center pl-[5vw] text-2xl`} style={{ color: item.winner.id === currentUserId ? "#fab387" : "grey" }}>
                                {item.winner.id === currentUserId ? "Win" : "Lose"}
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex justify-center text-maroon">
                                    VS
                                </div>
                                <button onClick={() => onProfileClick(item.winner.id === currentUserId ? item.loser.id : item.winner.id)} className="flex flex-col justify-center hover:scale-110 hover:text-gray-300 ">
                                    {item.winner.id === currentUserId ? item.loser.username : item.winner.username}
                                </button>
                            </div>
                            <div className="flex flex-col justify-center pr-[4vw]">
                                <div className="flex justify-center text-2xl" style={{ color: item.winner.id === currentUserId ? "#fab387" : "grey" }}>
                                    {item.winner.id === currentUserId ? item.winnerScore : item.loserScore} - {item.winner.id === currentUserId ? item.loserScore : item.winnerScore}
                                </div>
                                <div className="flex justify-center">
                                    {item.createdAt.slice(0, 10)}
                                </div>
                                <div className="flex justify-center">
                                    {item.createdAt.slice(11, 16)}
                                </div>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default matchHistory;