import { ChannelModel } from "@/app/utils/models";
import { channel } from "diagnostics_channel";

type ChannelProps = {
    channel: ChannelModel
}

// Todo: Add channel icon
const ChannelItem = ({ channel: { id, name, icon, type, joined } }: ChannelProps) => {

    const JoinChannel = async () => {
        if (type === "public") {
            try {
                const response = await fetch(`${process.env.BACK_URL}/chatroom/${id + 5}/join`, { credentials: "include", method: "PATCH" });
                const data = await response.json();
                console.log(data);
            } catch (err) {
                console.log("Error joining channel: " + err);
            }
            // Todo : how to update channel list ?
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
                {joined
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