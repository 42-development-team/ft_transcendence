import { ChannelModel } from "@/app/utils/models";
import { useState } from "react";

type ChannelProps = {
    channel: ChannelModel
}

// Todo: Add channel icon
const ChannelItem = ({ channel: { id, name, icon, type, joined } }: ChannelProps) => {

    const [isJoined, setIsJoined] = useState<boolean>(joined);

    const JoinChannel = async () => {
        console.log("Joining channel " + id);
        if (type === "public") {
            const response = await fetch(`${process.env.BACK_URL}/chatroom/${id}/join`, { credentials: "include", method: "PATCH" });
            if (!response.ok) {
                console.log("Error joining channel: " + await response.text());
                return ;
            }
            setIsJoined(true);
            // Todo : how to update channel list? - using socket?
        }
        else if (type === "private") {
            // Todo: get the password
            // Request to join the channel with the password
        }
    }

    return (
        <div className="flex flex-grow relative items-center justify-between mt-2 mb-2 hover:bg-surface1 rounded py-1 px-2 mr-2">
            <div className="flex items-center w-80">
                <h1 className="font-medium text-md">{name}</h1>
            </div>
            <div className="relative inline-block text-left">
                {isJoined
                    ? <div className="inline-flex justify-center w-full rounded-full px-3 py-2 font-semibold text-sm text-surface1 bg-text">
                        Joined</div>
                    : <button
                        type="button"
                        className="inline-flex justify-center w-full rounded-full px-5 py-2 font-semibold text-sm bg-surface1 hover:bg-base"
                        onClick={JoinChannel}>
                        Join</button>
                }
            </div>
        </div>
    )
}

export default ChannelItem;