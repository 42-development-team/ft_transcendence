"use client";

import { useEffect, useState } from "react";
import { DropDownActionSurrender } from "../dropdown/DropDownItem";
import DropDownMenu from "../dropdown/DropDownMenu";
import { GameInterface } from "./interfaces/game.interfaces";
import getUserNameById from "../utils/getUserNameById";

type GameHeaderInfoProps = {
    userId: string,
    data: GameInterface,
    surrender: (id: number, userId: number) => void
}

export function GameHeaderInfo({ userId, data, surrender }:  GameHeaderInfoProps) {

    const [opponnentUsername, setOpponnentUsername] = useState<string>("");
	const [currUserIsOnLeft, setCurrUserIsOnLeft] = useState<boolean>(false);
	const [userName, setUserName] = useState<string>("");

    const getAndSetUsersName = async (userId: string, opponentId: string) => {
		const name = await getUserNameById(userId);
		const opName = await getUserNameById(opponentId);
		setUserName(name);
		setOpponnentUsername(opName);
		console.log("my username:", name, userId);
		console.log("my opponent username:", opName, opponentId);
	}

    useEffect(() => {
        if (!data || !data.player1 || userId === undefined || userId === "")
            return;
        if (data.player1.id === parseInt(userId))
			getAndSetUsersName(userId, data.player2.id.toString());
		else
			getAndSetUsersName(userId, data.player1.id.toString());
    }, [currUserIsOnLeft]);

    useEffect(() => {
		if (!data || !data.player1 || userId === undefined || userId === "")
			return;

		console.log("p1 id:", data.player1.id); // p1 id is always left side => perfect

		setCurrUserIsOnLeft(data.player1.id === parseInt(userId));
		// if (data.player1.id === parseInt(userId))
		// 	getAndSetUsersName(userId, data.player2.id.toString());
		// else
		// 	getAndSetUsersName(userId, data.player1.id.toString());
	}, [data, userId]);

    return (
        <>
            {currUserIsOnLeft ? (
                <>
                    <div className="flex flex-row text-[2.2vw] text-white">
                        {userName}
                        <DropDownMenu width="w-4" height="h-4" color="bg-crust" position="bottom-10 right-2">
                            <DropDownActionSurrender onClick={() => surrender(data.id, parseInt(userId))}>
                                Surrender
                            </DropDownActionSurrender>
                        </DropDownMenu>
                    </div>
                    <div className="flex text-[2.2vw] text-white">{opponnentUsername}</div>
                </>
            ) : (
                <>
                    <div className="flex text-[2.2vw] text-white">{opponnentUsername}</div>
                    <div className="flex flex-row text-[2.2vw] text-white">
                        {userName}
                        <DropDownMenu width="w-4" height="h-4" color="bg-crust" position="bottom-10 right-2">
                            <DropDownActionSurrender onClick={() => surrender(data.id, parseInt(userId))}>
                                Surrender
                            </DropDownActionSurrender>
                        </DropDownMenu>
                    </div>
                </>
            )}
        </>
    )
}
