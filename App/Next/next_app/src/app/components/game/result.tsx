"use client";

import Avatar from "../profile/Avatar";
import { useEffect, useState } from "react";
import getUserNameById from "../utils/getUserNameById";
import getAvatarById from "../utils/getAvatarById";

const getUser = async (id: string) => {
    const avatar: string = await getAvatarById(id);
    const userName: string = await getUserNameById(id);

    const user = {id: id, userName: userName, avatar: avatar};
    return user;
}

const Result = async ({...props}) => {
    const {id, won} = props;
    console.log("id:", id);
    const user = await getUser(id);

    return (
        <div className="Winner">
            <Avatar
                width={64} height={64} imageUrlGetFromCloudinary={user.avatar} disableChooseAvatar={true} disableImageResize={true} currId={user.userId} isOnProfilePage={false}
            />
            {
                won === true ?
                <p>You Won!</p>
                :
                <p>You Lose...</p>
            }
        </div>
    );
};

export default Result;