import { FriendModel } from "@/app/utils/models";
import FriendItem from "./FriendItem";
import { useChatBarContext } from "@/app/context/ChatBarContextProvider";
import collapseImg from "../../../../public/collapse-left-svgrepo-com.svg"
import Image from 'next/image';

const FriendList = ({friends}: {friends: FriendModel[]}) => {

    const {toggleFriendListVisibility} = useChatBarContext();

    const friendsList = friends.map((friend) => (
        <FriendItem key={friend.id} friend={friend}/>
    ))
    
    return (
        <div className='w-full min-w-[450px] max-w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            <div className='flex flex-row justify-between border-b-2 pb-2 border-mantle'>
                <span className='font-semibold align-middle pl-2 pt-2'>
                    Friend List
                </span>
                <button onClick={toggleFriendListVisibility} >
                    <Image src={collapseImg} height={32} width={32} alt="Collapse" className='transition-all' />
                </button>
            </div>
            <div className='overflow-auto h-[86vh]'>
                {friendsList}
            </div>
        </div>
    )
}

export default FriendList;