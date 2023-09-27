import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { clickOutsideHandler } from "@/app/hooks/clickOutsideHandler";
import { useContext, useRef, useState } from "react";
import GameInviteContext from "@/app/context/GameInviteContext";
import DropDownActionGame from "../dropdown/DropDownActionGame";
import { useRouter } from "next/navigation";

type FriendProps = {
	user: UserModel
}

const FriendActions = ({ user }: FriendProps) => {
	const Router = useRouter();
	const [lockSubmit, setLockSubmit] = useState<boolean>(false);
	const wrapperRef = useRef<HTMLDivElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const { inviteToPlay } = useContext(GameInviteContext);

	clickOutsideHandler({ ref: wrapperRef, handler: () => setIsOpen(false) });
	const onProfileClick = () => {
		sessionStorage.setItem("userId", user.id);
		const currentRoute = window.location.pathname;
		if (sessionStorage.getItem("userId") !== undefined)
		{
			if (currentRoute === "/profile")
				window.location.href = "/profile";
			else
				Router.push("/profile");
		}
	}

	const removeFriend = async () => {
		await fetch(`${process.env.BACK_URL}/friend/removeFriend/${user.id}`, {
			credentials: "include",
			method: "PATCH"
		});
	}

	const handleAction = (action: () => void) => {
		if (lockSubmit) return;
		setLockSubmit(true);
		action();
		setIsOpen(false);
		setTimeout(() => setLockSubmit(false), 1500);
	}

	return (
		<div aria-orientation="vertical" >
			<DropDownAction onClick={() => handleAction(onProfileClick)}>
				View profile
			</DropDownAction>
			<DropDownActionGame>
				<DropDownAction onClick={() => handleAction(() => inviteToPlay(user.id, false))}>CLASSIC</DropDownAction>
				<DropDownAction onClick={() => handleAction(() => inviteToPlay(user.id, true))}>MODE</DropDownAction>
			</DropDownActionGame>
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
						: <Image alt="default avatar" src="https://img.freepik.com/free-icon/user_318-563642.jpg" height={32} width={32}
							className="w-[inherit] rounded-[inherit]" />
					}
					<div className="absolute bg-base p-[2px] rounded-full -bottom-[1px] -right-[1px]">
						<div className={`w-3 h-3 rounded-full ${getStatusColor(user.currentStatus)}`}></div>
					</div>
				</div>
				<h1 className="font-medium text-sm">{user.username}</h1>
			</div>
			<DropDownMenu>
				<FriendActions user={user} />
			</DropDownMenu>
		</div>
	)
}

export default FriendItem;
