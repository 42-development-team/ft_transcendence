"use client";

import Avatar from "../profile/Avatar";

export function DisplayResultData(
    { 
        user, opponent
    } : { 
        user: any, opponent: any 
    }) {
    return (
        <div className="flex flex-row  items-center justify-evenly bg-base rounded-lg bg-opacity-80 backdrop-blur-sm 
        text-xl sm:text-2xl md:text-3xl h-[54vw] sm:h-[28vw] md:h-[25vw] lg:h-[20vw] xl:h-[13vw] 2xl:h-[13vw] mb-10 transition-all">
            <div className="flex">
                {user ? (
                    <div className="flex flex-col text-center ">
                        {user.userElo}  {user.userEloDiff > 0 ? "(+" + user.userEloDiff + ")" : "(" + user.userEloDiff + ")"}
                        <Avatar
                            height={64} imageUrlGetFromCloudinary={user.avatar} disableChooseAvatar={true} currId={user.id} isOnProfilePage={false}
                        />
                        {user.userName}
                    </div>
                ) : (
                    <div className="flex w-16 h-16 bg-crust rounded-full animate-pulse">Loading..</div>
                )
                }
            </div>
            <div className="flex flex-row justify-evenly items-center w-[20%] text-mauve">
                <div className="flex">
                    {user ? user.score : "Loading..."}
                </div>
                <div className="flex">
                    -
                </div>
                <div className="flex">

                    {opponent ? opponent.score : "Loading.."}
                </div>
            </div>
            <div className="flex flex-row">
                {opponent ? (
                    <div className="flex flex-col text-center p-4">
                        {opponent.opponentElo} {opponent.opponentEloDiff > 0 ? "(+" + opponent.opponentEloDiff + ")" : "(" + opponent.opponentEloDiff + ")"}
                        <Avatar
                            height={64} imageUrlGetFromCloudinary={opponent.avatar} disableChooseAvatar={true} currId={opponent.id} isOnProfilePage={false}
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