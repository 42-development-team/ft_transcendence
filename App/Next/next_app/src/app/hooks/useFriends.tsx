"use client";
import { useEffect, useState } from "react";
import { UserModel } from "../utils/models";

export default function useFriends() {
	const [friends, setFriends] = useState<UserModel[]>([])
	const [blockedUsers, setBlockedUsers] = useState<UserModel[]>([])

	useEffect(() => {
		// Todo: fetch blocked users
		// Todo: fetch friends
	}, []);

	const blockUser = async (userId: string) => {
		try {
			console.log("blockUser with id: " + userId);
			const response = await fetch(`${process.env.BACK_URL}/friend/block/${userId}`, {
				credentials: "include",
				method: "PUT",
			});
			console.log(JSON.stringify(response));
		}
		catch (error) {
			console.log("Block user:" + error);
		}
	}

	return {
		friends,
		blockedUsers,
		blockUser,
	}
}