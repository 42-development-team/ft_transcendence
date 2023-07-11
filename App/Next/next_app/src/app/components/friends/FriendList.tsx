import FriendItem from "./FriendItem";

const FriendList = () => {
    
    return (
        <div className='w-[450px] px-2 py-2 rounded-r-lg bg-base border-crust border-2'>
            
            <FriendItem friend={"toto, online"}/>
            <FriendItem />
            <FriendItem />
            <FriendItem />
            <FriendItem />
        </div>
    )
}

export default FriendList;