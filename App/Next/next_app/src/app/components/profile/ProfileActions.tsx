
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "../dropdown/DropDownItem";
import { UserModel } from "@/app/utils/models";
import { useContext, useEffect, useState } from "react";
import GameInviteContext from "@/app/context/GameInviteContext";

type ProfileActionsProps = {
	userId: string;
	currentId: string;
	friends: UserModel[];
	invitedFriends: UserModel[];
	requestedFriends: UserModel[];
	addFriend: (friendAddingId: string) => void;
	blockedUsers: UserModel[];
	blockUser: (userId: string) => void;
	unblockUser: (userId: string) => void;
}

const ProfileActions = ({ userId, currentId, friends, invitedFriends, requestedFriends,
	addFriend, blockedUsers, blockUser, unblockUser }: ProfileActionsProps) => {
	const { inviteToPlay } = useContext(GameInviteContext);
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [isInvitedFriend, setIsInvitedFriend] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	// Prevent spam clicking
	const [lockSubmit, setLockSubmit] = useState<boolean>(false);
	const handleAction = (action: () => void) => {
		if (lockSubmit) return;
		setLockSubmit(true);
		action();
		setTimeout(() => setLockSubmit(false), 1500);
	}

	const removeFriend = async () => {
		console.log("removing friend");
		await fetch(`${process.env.BACK_URL}/friend/removeFriend/${currentId}`, {
			credentials: "include",
			method: "PATCH"
		});
	}

	useEffect(() => {
		if (userId == null || currentId == null) return;
		setIsFriend(friends.find(user => user.id == currentId) != undefined);
		setIsInvitedFriend(requestedFriends.find(user => user.id == currentId) != undefined
			|| invitedFriends.find(user => user.id == currentId) != undefined);
		setIsBlocked(blockedUsers.find(user => user.id == currentId) != undefined);
	}, [friends, invitedFriends, requestedFriends, currentId, blockedUsers]);

	return (
		<DropDownMenu>
			{!lockSubmit &&
				<>
					{!isInvitedFriend && !isFriend && !isBlocked &&
						<DropDownAction onClick={() => handleAction(() => addFriend(currentId))}>Add Friend</DropDownAction>
					}
					{!isBlocked &&
						<DropDownAction onClick={() => handleAction(() => inviteToPlay(currentId, false))}>Invite to play</DropDownAction>
					}
					{!isBlocked && !isFriend &&
						<DropDownActionRed onClick={() => handleAction(() => blockUser(currentId))}>Block</DropDownActionRed>
					}
					{isBlocked &&
						<DropDownActionRed onClick={() => handleAction(() => unblockUser(currentId))}>Unblock</DropDownActionRed>
					}
					{isFriend &&
						<DropDownActionRed onClick={() => handleAction(removeFriend)}>Remove Friend</DropDownActionRed>
					}
				</>
			}
		</DropDownMenu>
	)
}

export default ProfileActions;
