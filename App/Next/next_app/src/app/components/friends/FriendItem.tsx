import { UserModel } from "@/app/utils/models";
import Image from "next/image";
import DropDownMenu from "../dropdown/DropDownMenu";
import { DropDownAction, DropDownActionRed } from "@/app/components/dropdown/DropDownItem";
import { getStatusColor } from "@/app/utils/getStatusColor";

type FriendProps = {
    user: UserModel
}

const FriendActions = () => {

    // Todo: prevent double click
    // const [ lockSubmit, setLockSubmit ] = useState<boolean>(false);
	
	// const handleAction = (action: () => void) => {
    //     if (lockSubmit) return;
    //     setLockSubmit(true);
    //     action();
	// 	console.log("unblockUser");
    //     setTimeout(() => setLockSubmit(false), 1500);
    // }
    
    return (
        <div aria-orientation="vertical" >
            <DropDownAction onClick={() => console.log('Play')}>
                Invite to play
            </DropDownAction>
            <DropDownAction onClick={() => console.log('View Profile')}>
                View profile
            </DropDownAction>
            <DropDownActionRed onClick={() => console.log('Remove Friend')}>
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
                <FriendActions />
            </DropDownMenu>
        </div>
    )
}

export default FriendItem;