"use client";

import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";
import { useEffect, useState } from "react";
import CustomBtn from "../CustomBtn";
import Logo from "../home/Logo";
import { DisplayResultData } from "./DisplayResultData";
import { useRouter } from "next/router";

const Result = ({ ...props }) => {
    const { result, setResult, joinQueue, setInGameContext, data } = props;
    const [user, setUser] = useState<{ id: string, userName: string, avatar: string, score: number }>();
    const [opponent, setOpponent] = useState<{ id: string, userName: string, avatar: string, score: number }>();
    const [queued, setQueued] = useState<boolean>(false);
    const Router = useRouter();

    useEffect(() => {
        if (!data || !data.player1) {
            return;
        }
        const currUserScore: number = data.player1.id === parseInt(result.id) ? data.player1.points : data.player2.points;
        const opponentScore: number = data.player1.id === parseInt(result.id) ? data.player2.points : data.player1.points;
        const getUser = async (id: string) => {
            const avatar = await getAvatarById(id);
            const userName = await getUserNameById(id);
            setUser({ id, userName, avatar, score: currUserScore });
        };
        const getOpponent = async (id: string) => {
            const avatar = await getAvatarById(id);
            const userName = await getUserNameById(id);
            setOpponent({ id, userName, avatar, score: opponentScore });
        };

        getUser(result.id);
        console.log("data.player", data.player1, data.player2);
        getOpponent(data.player1.id === parseInt(result.id) ? data.player2.id : data.player1.id);
    }, [result.id, data.player1.id]);

    const matchmaking = async () => {
        setQueued(true);
        await joinQueue();
        setResult(undefined);
        setInGameContext(false);
    }

    const backHome = () => {
        setQueued(false);
        setResult(undefined);
        setInGameContext(false);
        Router.push("/");
    }

    return (
        <div className="flex flex-col justify-evenly h-full w-full">
            {result.won === true ? (
            <div className="flex justify-center text-xl">
                <Logo text="victory" colorTextOverride="text-peach"/>
            </div>
            ) : (
                <div className="flex justify-center text-xl">
                    <Logo text="defeat" colorTextOverride="text-red" />
                </div>
            )}
            <div className="flex flex-col ">
                <DisplayResultData  user={user} opponent={opponent} />
                <CustomBtn
                    anim={true}
                    color={'bg-mauve'}
                    id="Play Again Button"
                    onClick={matchmaking}
                    disable={false}
                >
                    Play Again
                </CustomBtn>
                <CustomBtn
                    anim={true}
                    color={'bg-red'}
                    id="Play Again Button"
                    onClick={backHome}
                    disable={false}
                >
                    Play Again
                </CustomBtn>
            </div>
        </div>
    )

};

export default Result;