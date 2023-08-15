"use client";
import { useCallback, useState } from "react";
import { UserModel } from "../utils/models";

export default function useFriends() {
    const [friends, setFriends] = useState<UserModel[]>([
    ])

    // const socket = useChatConnection();

    const appendNewFriend = useCallback(
        (newFriend: UserModel) => {
            const nextFriends: UserModel[] = [
                ...friends,
                newFriend
            ]
            setFriends(nextFriends);
        },
        [friends]
    )

    const createFriend = useCallback(
        () => {
            // const newFriend: UserModel = generateFakeFriend();
            // appendNewChannel(newChannel);
            // socket?.emit('channel', newChannel);
            console.log(`new friend creation `);
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