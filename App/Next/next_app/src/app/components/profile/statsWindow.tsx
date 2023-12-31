"use client";
import { useEffect, useState } from "react";
import Avatar from "../../components/profile/Avatar";
import Stats from "./Stats";
import sessionStorageUser from "./sessionStorage";
import getAvatarById from "../utils/getAvatarById";
import { UserModel } from "@/app/utils/models";
import ProfileActions from "./ProfileActions";

type StatsWindowProps = {
	userId: string;
	friends: UserModel[];
    invitedFriends: UserModel[];
    requestedFriends: UserModel[];
    addFriend: (friendAddingId: string) => void;
    blockedUsers: UserModel[];
    blockUser: (userId: string) => void;
    unblockUser: (userId: string) => void;
}
const StatsWindow = ({ userId, friends, invitedFriends, requestedFriends, addFriend,
	blockedUsers, blockUser, unblockUser }: StatsWindowProps) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null);
	const [statsData, setStatsData] = useState<any>("null");
	const [avatarFile, setAvatarFile] = useState<File | null>(null);

	useEffect(() => {
		if (userId === undefined || userId === "") return ;
		let sessionUserId = null;
		sessionUserId = sessionStorageUser();

		if (sessionUserId !== null && sessionUserId !== undefined) {
			userId = sessionUserId as string;
		}

		const getAvatar = async () => {
			setImageUrl(await getAvatarById(userId));
		}

		const getStats = async () => {
			const response = await fetch(`${process.env.BACK_URL}/userstats/info/${userId}`, {
				credentials: "include",
				method: "GET",
			});
			const data = await response.json();
			setStatsData(await data);
		}

		try {
			if (userId === undefined || userId === "") return ;
			getAvatar();
			getStats();
		} catch (error) {
			console.log("Error response when fetching userstats/info:", error);
		}
	}, [userId]);

	const handleCallBackDataFromAvatar = (childAvatarFile: File | null, childImageUrl: string | null) => {
		setAvatarFile(childAvatarFile);
		setImageUrl(childImageUrl);
	}

	return (
		<div className="flex flex-col sm:flex-row mb-5 ">
			<Avatar
				disableChooseAvatar={true}
				imageUrlGetFromCloudinary={imageUrl}
				CallbackAvatarData={handleCallBackDataFromAvatar}
				userName={statsData.userName}
				id={statsData.userId}
				currId={userId}
				isOnProfilePage={true} >
					<ProfileActions userId={userId} currentId={statsData.userId} friends={friends} invitedFriends={invitedFriends}
						requestedFriends={requestedFriends} addFriend={addFriend} blockedUsers={blockedUsers} blockUser={blockUser}
						unblockUser={unblockUser} />
			</Avatar>
			<div className=" w-full sm:ml-[2vw] font-semibold text-gray-400 text-center hover:duration-[550ms] rounded-lg
                bg-surface0 bg-opacity-90 hover:shadow-[0_35px_55px_-20px_rgba(0,0,0,0.15)]">
				<Stats userId={userId} stats={statsData} />
			</div>
		</div>
	)
}

export default StatsWindow;