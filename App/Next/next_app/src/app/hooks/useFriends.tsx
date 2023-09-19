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
		socket?.on('friendUpdate', (body: any) => {
			fetchFriends();
		});
		socket?.on('blockUpdate', (body: any) => {
			fetchBlockedUsers();
			console.log("blockUpdate");
		});

		return () => {
			socket?.off('friendUpdate');
			socket?.off('blockUpdate');
		}
	}, [socket, friends]);

	// FRIENDS

	const fetchFriends = async () => {
		fetchFriendsRequest();
		fetchInvitedFriends();
		const response = await fetch(`${process.env.BACK_URL}/friend/getFriends`, { credentials: "include", method: "GET" });
		const data = await response.json();
		setFriends(data);
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

	const addFriend = async (friendAddingId: string) => {
		try {
			const response = await fetch(`${process.env.BACK_URL}/friend/requestFriend/${friendAddingId}`, {
				credentials: "include",
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json'
				},
			});
			if (!response.ok) {
				console.log("Error adding user as a friend: " + response.status);
			}
		}
		catch (error) {
			console.log("Error adding user as a friend: " + error);
		}
	}

	// BLOCKED USERS
	const fetchBlockedUsers = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/blocked`, { credentials: "include", method: "GET" });
		const data = await response.json();
		console.log(JSON.stringify(data));
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
		}
		catch (error) {
			console.log("Block user:" + error);
		}
	}

	return {
		friends,
		invitedFriends,
		requestedFriends,
		addFriend,
		blockedUsers,
		blockUser,
		unblockUser,
	}
}
