"use client";

import { useCallback, useEffect, useState } from "react";
import { FriendModel } from "../utils/models";
import { generateFakeFriend } from "../utils/helpers";

const fakeFriends: FriendModel[] = Array(20)
    .fill(null)
    .map(() => generateFakeFriend())

export default function useFriends() {
    const [friends, setFriends] = useState<FriendModel[]>([
        ...fakeFriends,
    ])

    // const socket = useChatConnection();

    const appendNewFriend = useCallback(
        (newFriend: FriendModel) => {
            const nextFriends: FriendModel[] = [
                ...friends,
                newFriend
            ]
            setFriends(nextFriends);
        },
        [friends]
    )

    const createFriend = useCallback(
        () => {
            const newFriend: FriendModel = generateFakeFriend();
            // appendNewChannel(newChannel);
            // socket?.emit('channel', newChannel);
            console.log(`new friend creation ${newFriend.username}`);
        },
        []
    )

    // useEffect(() => {
    //     // socket?.on('new-friend', (friend: FriendModel) => {
    //     //     appendNewFriend(friend);
    //     // })
    //     return (
    //         console.log("Unsuscribe from new-friend")
    //          socket?.off('new-friend')
    //     )
    // }, [appendNewFriend, socket])

    return {
        friends,
        createFriend,
    }
}