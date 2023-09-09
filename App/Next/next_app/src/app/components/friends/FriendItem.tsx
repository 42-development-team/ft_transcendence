import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { Alert } from "@material-tailwind/react";
import { useEffect, useRef, useState } from "react";
import { useUserRole } from "../../components/chat/chatbox/members/UserRoleProvider";
// import FriendList from "./FriendList";

type FriendProps = {
    user: UserModel
}

const FriendActions = ({user}: FriendProps) => {
	const { isCurrentUserAdmin, isCurrentUserOwner } = useUserRole();
	const [ isOpen, setIsOpen ] = useState(false);
	const [ openAlert, setOpenAlert ] = useState(false);
	const [ lockSubmit, setLockSubmit ] = useState<boolean>(false);

	const onProfileClick = () => {
			console.log("userId = ", user.id);
			sessionStorage.setItem("userId", user.id);
		if (sessionStorage.getItem("userId") === undefined)
			setOpenAlert(true);
		else
			window.location.href = "/profile";
	}

	const removeFriend = async () => {
		const response = await fetch(`${process.env.BACK_URL}/friend/removeFriend/${user.id}`, {
			credentials: "include",
			method: "PATCH"
		});
		// const data = await response.json();
	}

	const handleAction = (action: () => void) => {
		if (lockSubmit) return;
		setLockSubmit(true);
		action();
		setIsOpen(false);
		setTimeout(() => setLockSubmit(false), 1500);
	}

	// todo callback func to remove friend
	// todo callback func to invite to play
	return (
        <div aria-orientation="vertical" >
            <DropDownAction onClick={() => handleAction(() =>console.log('Play'))}>
				Invite to play
			</DropDownAction>
            <DropDownAction onClick={() => handleAction(onProfileClick)}>
				View profile
			</DropDownAction>
            <DropDownActionRed onClick={() => handleAction(removeFriend)}>
                Remove Friend
            </DropDownActionRed>
        </div>
    )
}

const FriendItem = ({ user }: FriendProps) => {
    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
            <div className="flex items-center">
                <div className="relative mr-2 rounded-full w-10 h-10 object-cover">
                    {user.avatar.startsWith("https://")
                        ? <Image alt="Member avatar" src={user.avatar} height={32} width={32}
                            className="w-[inherit] rounded-[inherit]" />
                        : null
                    }
                    <div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(user.currentStatus)}`}></div>
                    </div>
                </div>
                <h1 className="font-medium text-sm">{user.username}</h1>
            </div>
            <DropDownMenu >
                <FriendActions user={user}/>
            </DropDownMenu>
        </div>
    )
}

export default FriendItem;
