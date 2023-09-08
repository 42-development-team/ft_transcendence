import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import { getStatusColor } from "@/app/utils/getStatusColor";
import { Tooltip } from "@material-tailwind/react";
import { useState } from "react";

type BlockedProps = {
	user: UserModel
	unblockUser: (unblockedId: string) => void
}

const BlockUserItem = ({ user, unblockUser }: BlockedProps) => {
    const [ lockSubmit, setLockSubmit ] = useState<boolean>(false);

	const handleAction = (action: () => void) => {
        if (lockSubmit) return;
        setLockSubmit(true);
        action();
		console.log("unblockUser");
        setTimeout(() => setLockSubmit(false), 1500);
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
			<div className="relative inline-block text-left">
				<Tooltip placement="left" content="Unblock" className="tooltip">
					<button onClick={() => handleAction(() => unblockUser(user.id))} 
						className="inline-flex justify-center w-full rounded-2xl px-2 py-2 bg-base group" >
						<svg aria-hidden="true" role="img" width="24" height="24" viewBox="0 0 24 24">
							<path className="group-hover:fill-red" fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M20.2949 0.298996L21.7089 1.713L19.4169 4.006L21.7089 6.299L20.2949 7.713L18.0019 5.42L15.7099 7.713L14.2949 6.299L16.5879 4.006L14.2949 1.713L15.7099 0.298996L18.0019 2.592L20.2949 0.298996ZM8.00195 13.006C10.207 13.006 12.002 11.211 12.002 9.006C12.002 6.801 10.207 5.006 8.00195 5.006C5.79695 5.006 4.00195 6.801 4.00195 9.006C4.00195 11.211 5.79695 13.006 8.00195 13.006ZM8.00195 14.006C3.29095 14.006 0.00195312 16.473 0.00195312 20.006V21.006H16.002V20.006C16.002 16.473 12.713 14.006 8.00195 14.006Z"></path>
						</svg>
					</button>
				</Tooltip>
			</div>
		</div >
	)
}

export default BlockUserItem;