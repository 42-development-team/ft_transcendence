"use client";

import Avatar from "../profile/Avatar";
import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";
import { useEffect, useState } from "react";


const Result = ({...props}) => {
    const { result } = props;
    const [user, setUser] = useState<{id: string, userName: string, avatar: string}>();

    useEffect(() => {
        const getUser = async (id: string) => {
            const avatar = await getAvatarById(id);
            const userName = await getUserNameById(id);

            setUser({ id, userName, avatar });
        };

        getUser(result.id);
    }, [result.id]);

    return (
        // <div className="Winner">
        // <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col my-5 justify-center ">
            <div className=" flex fex-row items-center justify-center font-bold text-center text-2xl mb-2">

        {/* <div className="grid place-items-center w-64 h-40 rounded-lg bg-black"></div> */}
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
      

        // {/* </div> */}
    );
};

export default Result;