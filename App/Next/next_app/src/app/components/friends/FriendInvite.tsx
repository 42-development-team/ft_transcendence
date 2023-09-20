import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { useState } from "react";

type FriendProps = {
	user: UserModel
	hideActions?: boolean
}

const FriendInvite = ({ user, hideActions }: FriendProps) => {
    const [ lockSubmit, setLockSubmit ] = useState<boolean>(false);

	const handleAction = (action: () => void) => {
        if (lockSubmit) return;
        setLockSubmit(true);
        action();
        setTimeout(() => setLockSubmit(false), 1500);
    }

	const acceptFriendRequest = async () => {
		await fetch(`${process.env.BACK_URL}/friend/acceptFriend/${user.id}`, {
			credentials: "include",
			method: "PATCH"
		});
	}

	const refuseFriendRequest = async () => {
		await fetch(`${process.env.BACK_URL}/friend/refuseFriend/${user.id}`, {
			credentials: "include",
			method: "PATCH"
		});
	}

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
			{!hideActions &&
				<div className="flex gap-4">
					<button
						onClick={() => handleAction(acceptFriendRequest)}
						className="bg-green rounded text-base py-1 px-2 hover:bg-teal">
						Accept
					</button>
					<button
						onClick={() => handleAction(refuseFriendRequest)}
						className="bg-surface2 rounded py-1 px-2 hover:bg-base">
						Ignore
					</button>
				</div>
			}
        </div>
    )
}

export default FriendInvite;
