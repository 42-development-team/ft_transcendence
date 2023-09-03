"use client";
import { useEffect, useState } from "react";
import { UserModel } from "../utils/models";

export default function useFriends() {
	const [friends, setFriends] = useState<UserModel[]>([])
	const [blockedUsers, setBlockedUsers] = useState<UserModel[]>([])

	useEffect(() => {
		fetchBlockedUsers();
		// Todo: fetch friends
	}, []);

	const fetchBlockedUsers = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/blocked`, { credentials: "include", method: "GET" });
		const data = await response.json();
		setBlockedUsers(data);
	}

	const updateBlockedUsers = (newBlockedUser: UserModel) => {
		const exisitingUserIndex = blockedUsers.findIndex((user: UserModel) => user.id === newBlockedUser.id);
		if (exisitingUserIndex !== -1) {
			const newBlockedUsers = [...blockedUsers];
			newBlockedUsers[exisitingUserIndex] = newBlockedUser;
			setBlockedUsers(newBlockedUsers);
		}
		else {
			setBlockedUsers([...blockedUsers, newBlockedUser]);
		}
	}

	const updateFriends = (newFriend: UserModel) => {
		const exisitingUserIndex = friends.findIndex((user: UserModel) => user.id === newFriend.id);
		if (exisitingUserIndex !== -1) {
			const newFriends = [...friends];
			newFriends[exisitingUserIndex] = newFriend;
			setFriends(newFriends);
		}
		else {
			setFriends([...friends, newFriend]);
		}
	}

	const blockUser = async (blockedId: string) => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/friend/block/${blockedId}`, {
				credentials: "include",
				method: "PATCH",
			});
			updateBlockedUsers(await response.json());
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