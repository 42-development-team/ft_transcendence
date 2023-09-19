
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "../dropdown/DropDownItem";
import { UserModel } from "@/app/utils/models";
import { useEffect, useState } from "react";

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
	const [isFriend, setIsFriend] = useState<boolean>(false);
	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	// Prevent spam clicking
	const [lockSubmit, setLockSubmit] = useState<boolean>(false);
	const handleAction = (action: () => void) => {
		if (lockSubmit) return;
		setLockSubmit(true);
		action();
		setTimeout(() => setLockSubmit(false), 1500);
	}

	useEffect(() => {
		if (userId == null || currentId == null) return;
		setIsFriend(friends.find(user => user.id == currentId) != undefined 
			|| requestedFriends.find(user => user.id == currentId) != undefined 
			|| invitedFriends.find(user => user.id == currentId) != undefined);
		setIsBlocked(blockedUsers.find(user => user.id == currentId) != undefined);
	}, [friends, invitedFriends, requestedFriends, currentId, blockedUsers]);

	return (
		<DropDownMenu>
			{!isFriend && !isBlocked &&
				<>
					<DropDownAction onClick={() => handleAction(() => addFriend(currentId))}>Add Friend</DropDownAction>
					<DropDownActionRed onClick={() => handleAction(() => blockUser(currentId))}>Block</DropDownActionRed>
				</>
			}
			{!isBlocked &&
				<DropDownAction onClick={() => handleAction(() => console.log("test"))}>Invite to play</DropDownAction>
			}
			{isBlocked &&
				<DropDownActionRed onClick={() => handleAction(() => unblockUser(currentId))}>Unblock</DropDownActionRed>
			}
		</DropDownMenu>
	)
}

export default ProfileActions;
