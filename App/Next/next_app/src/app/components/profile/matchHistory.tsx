'use client';

import { useContext, useState } from "react";
import ThemeContext from "../theme/themeContext";

const matchHistory = ( props: { data: any, currentUserId: number } ) => {
    const data = Array.isArray(props.data) ? props.data : [];
    const currentUserId = props.currentUserId;
    const [ openAlert, setOpenAlert ] = useState(false);
    const {theme} = useContext(ThemeContext);

    const onProfileClick = (userId: number) => {
        sessionStorage.setItem("userId", userId.toString());
        if (sessionStorage.getItem("userId") === undefined)
            setOpenAlert(true);
        else
            window.location.href = "/profile";
    }

    return (
        <div className="p-6 h-[50vh] overflow-auto">
            { data.length !== 0 ? (
            <div className="flex flex-col">
                {data.map((item: any, index: number) => (
                    <div key={index} className={item.winner.id === currentUserId ? 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-peach to-surface1'
                        : 'rounded pl-1 pb-1 flex flex-row justify-between h-[120px] m-2 my-4 text-xl font-bold bg-gradient-to-r from-gray-500 to-gray'}>
                        <span className=" flex flex-grow justify-between bg-gradient-to-r from-base to-surface0 sm:px-2">
                            <div className={`flex flex-col justify-center pl-[2vw] sm:pl-[5vw] sm:text-[1.6rem] md:text-[1.8rem]`} style={{ color: item.winner.id === currentUserId ? "#fab387" : "grey" }}>
                                {item.winner.id === currentUserId ? "Win" : "Lose"}
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="flex justify-center text-red sm:text-2xl">
                                    VS
                                </div>
                                <button onClick={() => onProfileClick(item.winner.id === currentUserId ? item.loser.id : item.winner.id)} className="flex flex-col sm:text-[1.5rem] md:text-[1.7rem] text-gray-400 justify-center hover:scale-110 hover:text-teal ">
                                    {item.winner.id === currentUserId ? item.loser.username : item.winner.username}
                                </button>
                            </div>
                            <div className="flex flex-col justify-center pr-[4vw]">
                                <div className="flex justify-center sm:text-[1.5rem]" style={{ color: item.winner.id === currentUserId ? "Peach" : "grey" }}>
                                    {item.winner.id === currentUserId ? item.winnerScore : item.loserScore} - {item.winner.id === currentUserId ? item.loserScore : item.winnerScore}
                                </div>
                                <div className="flex justify-center italic font-light">
                                    {item.createdAt.slice(0, 10)}
                                </div>
                                <div className="flex justify-center italic font-light">
                                    {item.createdAt.slice(11, 16)}
                                </div>
                            </div>
                        </span>
                    </div>
                ))}
            </div>
            ) : (
                <div className="flex flex-col h-full justify-center">
                        <span className="flex justify-center text-[5rem] text-gray-700 leading-[5rem]">
                            No games played
                        </span>
                </div>
            )}
        </div>
    )
}
export default matchHistory;