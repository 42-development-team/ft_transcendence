"use client";

import Avatar from "../profile/Avatar";
import { useEffect, useState } from "react";

const getUser = async (userId: number) => {
    return await fetch(`${process.env.BACK_URL}/users/${userId}`, {
        method: "GET",
        credentials: "include",
    }
)};

const Result = ({...props}) => {

    const {id, won} = props;
    const [user, setUser] = useState<null | any>(getUser(id));

// avatar : reutiliser composant avatar / se referer a leaderBoard
// fetch user et envoyer avatar au composant avatar / isOnProfilePage to false
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