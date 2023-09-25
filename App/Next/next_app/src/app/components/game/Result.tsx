"use client";

import Avatar from "../profile/Avatar";
import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";
import { useEffect, useState } from "react";
import CustomBtn from "../CustomBtn";


const Result = ({...props}) => {
    const { result, setResult, joinQueue, setInGameContext} = props;

    const [user, setUser] = useState<{id: string, userName: string, avatar: string}>();
    const [queued, setQueued] = useState<boolean>(false);

    useEffect(() => {
        const getUser = async (id: string) => {
            const avatar = await getAvatarById(id);
            const userName = await getUserNameById(id);

            setUser({ id, userName, avatar });
        };
        
        getUser(result.id);
    }, [result.id]);

    const matchmaking = async () => {
		setQueued(true);
		await joinQueue();
        setResult(undefined);
        setInGameContext(false);
	}

    return (
        <div className="flex flex-col my-5 justify-center ">
            <CustomBtn
                anim={true}
                color={'bg-mauve'}
                id="Play Again Button" 
                onClick={matchmaking} 
                disable={false}
            >
                Play Again
            </CustomBtn>
            <div className=" flex flex-row items-center justify-center font-bold text-center text-2xl mb-2">
                {user?.avatar &&
                    <Avatar
                        width={64} height={64} imageUrlGetFromCloudinary={user.avatar} disableChooseAvatar={true} disableImageResize={true} currId={user.id} isOnProfilePage={false}
                    />
                }
                {
                    result.won === true ?
                    <p>You Won!</p>
                    :
                    <p>You Lose...</p>
                }
            </div>
        </div>
    );
};

export default Result;