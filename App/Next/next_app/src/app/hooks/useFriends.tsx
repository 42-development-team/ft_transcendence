"use client";
import { useEffect, useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { UserModel } from "../utils/models";

export default function useFriends() {
	const { socket } = useAuthContext();
	const [friends, setFriends] = useState<UserModel[]>([])
	const [invitedFriends, setInvitedFriends] = useState<UserModel[]>([])
	const [requestedFriends, setRequestedFriends] = useState<UserModel[]>([])
	const [blockedUsers, setBlockedUsers] = useState<UserModel[]>([])

	useEffect(() => {
		fetchBlockedUsers();
		fetchFriends();
	}, []);

	useEffect(() => {
		socket?.on('friendRequest', (body: any) => {
			fetchFriends();
		});
		socket?.on('friendRemoval', (body: any) => {
			fetchFriends();
		});

		return () => {
			socket?.off('friendRequest');
			socket?.off('friendRemoval');
		}
	}, [socket, friends]);

	const fetchFriends = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/getFriends`, { credentials: "include", method: "GET" });
		const data = await response.json();
		setFriends(data);
		fetchFriendsRequest();
		fetchInvitedFriends();
	}
	const fetchInvitedFriends = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/getInvitedFriends`, { credentials: "include", method: "GET" });
		const data = await response.json();
		setInvitedFriends(data);
	}

	const fetchFriendsRequest = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/getFriendsRequest`, { credentials: "include", method: "GET" });
		const data = await response.json();
		setRequestedFriends(data);
	}

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

	const removeBlockedUser = (unblockedUser: UserModel) => {
		const newBlockedUsers = blockedUsers.filter((user: UserModel) => user.id !== unblockedUser.id);
		setBlockedUsers(newBlockedUsers);
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

	const unblockUser = async (unblockedId: string) => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/friend/unblock/${unblockedId}`, {
				credentials: "include",
				method: "PATCH",
			});
			removeBlockedUser(await response.json());
		}
		catch (error) {
			console.log("Block user:" + error);
		}
	}

	return {
		friends,
		blockedUsers,
		blockUser,
		unblockUser,
		invitedFriends,
		requestedFriends,
	}
}
