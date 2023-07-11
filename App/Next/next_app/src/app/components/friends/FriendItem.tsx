import { FriendModel } from "@/app/utils/models";

type FriendProps = {
    friend: FriendModel
}

const FriendItem = ({friend: {username, status}} : FriendProps) => {
    return (
        <div>
            <h1>FriendItem</h1>
        </div>
    )
}

export default FriendItem;