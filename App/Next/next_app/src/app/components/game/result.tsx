"use client";

import Avatar from "../profile/Avatar";
import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";
import { useEffect, useState } from "react";
import CustomBtn from "../CustomBtn";


const Result = ({...props}) => {
    const { result, joinQueue, leaveQueue} = props;

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
		setQueued(true)
		// setUserAlreadyQueued(true);
		// setDisable(true)
		// setGameLoading(true);
		await joinQueue();

	}

    const cancelMatchmaking = async () => {
        setQueued(false);
        await leaveQueue();
    }

    return (
        // <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col my-5 justify-center ">
            {queued ?
                <CustomBtn
                anim={true}
                color={'bg-mauve'}
                id="Cancel" 
                onClick={cancelMatchmaking} 
                disable={false}
                >
                    Cancel
                </CustomBtn>
            :
                <CustomBtn
                    anim={true}
                    color={'bg-mauve'}
                    id="Play Again Button" 
                    onClick={matchmaking} 
                    disable={false}
                >
                    Play Again
                </CustomBtn>
            }
            <div className=" flex fex-row items-center justify-center font-bold text-center text-2xl mb-2">

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
        // <div>
        // </div>

    );
};

export default Result;