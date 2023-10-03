"use client";

import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";
import { use, useEffect, useState } from "react";
import CustomBtn from "../CustomBtn";
import Logo from "../home/Logo";
import { DisplayResultData } from "./DisplayResultData";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";

const Result = ({ ...props }) => {
    const router = useRouter();
    const { userId } = useAuthContext();
    const { result, setResult, setInGameContext, data } = props;
    const [user, setUser] = useState<{ id: string, userName: string, avatar: string, score: number, userElo: number, userEloDiff: number }>();
    const [opponent, setOpponent] = useState<{ id: string, userName: string, avatar: string, score: number, opponentElo: number, opponentEloDiff: number }>();
    const [queued, setQueued] = useState<boolean>(false);

    useEffect(() => {
        if (!data || !data.player1 || userId === undefined || userId === "") {
            return;
        }
        const currUserScore: number = data.player1.id === parseInt(result.id) ? data.player1.points : data.player2.points;
        const opponentScore: number = data.player1.id === parseInt(result.id) ? data.player2.points : data.player1.points;
        const userElo: number = result.won === true ? result.elo.winnerElo : result.elo.loserElo;
        const opponentElo: number = result.won === true ? result.elo.loserElo : result.elo.winnerElo;
        const userEloDiff: number = result.won === true ? result.elo.winnerEloChange : result.elo.eloLoserChange;
        const opponentEloDiff: number = result.won === true ? result.elo.eloLoserChange : result.elo.eloWinnerChange;
        const getUser = async (id: string) => {
            const avatar = await getAvatarById(id);
            let userName: string = await getUserNameById(id);
            if ( userName.length > 4 && window.innerWidth < 920 ) {
                userName = userName.slice(0, 4);
                userName += "..";
            }
            setUser({ id, userName, avatar, score: currUserScore, userElo, userEloDiff });
        };
        const getOpponent = async (id: string) => {
            const avatar = await getAvatarById(id);
            let userName: string = await getUserNameById(id);
            if ( userName.length > 4 && window.innerWidth < 920 ) {
                userName = userName.slice(0, 4);
                userName += "..";
            }
            setOpponent({ id, userName, avatar, score: opponentScore, opponentElo, opponentEloDiff });
        };

        getUser(result.id);
        getOpponent(data.player1.id === parseInt(result.id) ? data.player2.id : data.player1.id);
    }, [result.id, data.player1.id]);

    const backHome = () => {
        setQueued(false);
        setResult(undefined);
        setInGameContext(false);
        router.push("/home");
    }

    return (
        <div className="flex flex-col justify-evenly h-full w-full">
            {result.won === true ? (
                <div className="flex justify-center text-xl">
                    <Logo text="victory" colorTextOverride="text-peach" />
                </div>
            ) : (
                <div className="flex justify-center text-xl">
                    <Logo text="defeat" colorTextOverride="text-red" />
                </div>
            )}
            <div className="flex flex-col">
                <DisplayResultData user={user} opponent={opponent} />
                <div className="flex flex-col items-center">
                    <CustomBtn
                        anim={true}
                        color={'bg-red'}
                        id="Play Again Button"
                        onClick={backHome}
                        disable={false}
                        width="w-[35%]"
                    >
                        Home
                    </CustomBtn>
                </div>
            </div>

        </div>
    )

};

export default Result;